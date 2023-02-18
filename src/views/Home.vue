<template>
  <v-container class="ml-auto mr-auto">
    <v-alert
      :value="showErrorMessage"
      color="pink"
      dark
      dismissible
      border="top"
      icon="mdi-house"
      transition="scale-transition">
      {{ errorMessage }}
    </v-alert>

    <v-dialog v-model="taskDialog" scrollable max-width="80%">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on"> Open Dialog </v-btn>
      </template>
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <small>{{ currentTask.name }}</small>
          <v-btn icon @click="taskDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div>Descrição: {{ currentTask.description }}</div>
          <div>Status: {{ currentTaskStatus }}</div>
          <br />
          <div>Criado em: {{ currentTaskDateCreated }}</div>
          <div>Atualizado em: {{ currentTaskDateUpdated }}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="taskDialog = false"> Fechar </v-btn>
          <v-btn color="blue darken-1" text @click="taskDialog = false"> Salvar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row class="text-center">
      <v-col cols="12">
        <div class="new-item">
          <input
            class="new-todo"
            autofocus
            autocomplete="off"
            :placeholder="isRecording ? 'Escutando...' : 'O que tem em mente?'"
            v-model="newTodo"
            @keyup.enter="addTodo" />
          <button class="speech" @click="startRecognition">
            <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
              <path
                fill="#525299"
                d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
            </svg>
          </button>
        </div>
        <section class="main" v-show="currentListTasks.length && !currentListTasksLoading" v-cloak>
          <!-- <input
						id="toggle-all"
						class="toggle-all"
						type="checkbox"
						v-model="allDone"
					/> -->
          <label for="toggle-all"></label>
          <!-- <ul class="todo-list">
						<li
							v-for="todo in filteredTodos"
							class="todo"
							:key="todo.id"
							:class="{
								completed: todo.completed,
								editing: todo == editedTodo,
							}"
						>
							<div class="view">
								<input
									class="toggle"
									type="checkbox"
									v-model="todo.completed"
								/>
								<label class="toggle-text" @dblclick="editTodo(todo)">{{
									todo.title
								}}</label>
								<div class="do-edit" @click="editTodo(todo)">EDITAR</div>
								<button class="destroy" @click="removeTodo(todo)"></button>
							</div>
							<input
								class="edit"
								type="text"
								v-model="todo.title"
								v-todo-focus="todo == editedTodo"
								@blur="doneEdit(todo)"
								@keyup.enter="doneEdit(todo)"
								@keyup.esc="cancelEdit(todo)"
							/>
						</li>
					</ul> -->
        </section>
        <v-sheet color="grey lighten-4" class="pa-3" v-if="currentListTasksLoading">
          <v-skeleton-loader class="mx-auto" max-width="300" type="card"></v-skeleton-loader>
        </v-sheet>
        <v-list two-line>
          <v-list-item-group v-model="selected" active-class="pink--text" multiple>
            <template v-for="(item, index) in currentListTasks" :key="item.id">
              <v-list-item @click="openTaskDialog(item)">
                <template v-slot:default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title class="d-flex" v-text="item.name"></v-list-item-title>

                    <v-list-item-subtitle class="d-flex text--primary"
                      >Status: {{ item.status.status }} - Atualiazado em
                      {{ item.date_updated_normalized }}</v-list-item-subtitle
                    >

                    <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <!-- <v-list-item-action-text >Finalizar</v-list-item-action-text> -->

                    <v-icon v-if="!active" color="grey lighten-1"> mdi-star-outline </v-icon>

                    <v-icon v-else color="yellow darken-3"> mdi-star </v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>

              <v-divider v-if="index < currentListTasks.length - 1" :key="index"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
    <v-overlay :value="myLow.overlay" color="#1A237E">
      <h1 class="maylon-on">Maylon está ouvindo</h1>
      <p>Você disse: {{ myLow.currentText }}</p>
    </v-overlay>
  </v-container>
</template>

<script>
  import { useListsStore } from '../store/lists'
  export default {
    name: 'Home',

    data: () => ({
      selected: [],
      timezoneOptions: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      },
      showErrorMessage: false,
      errorMessage: '',
      newTodo: '', // TODO: Tranformar em objeto (todo) para usar novas props
      editedTodo: null,
      visibility: 'all',
      recognition: null,
      speechRecognitionList: null,
      isRecording: false,
      taskDialog: false,
      currentTask: {
        id: '',
        name: '',
        description: '',
        status: '',
        date_created: '',
        date_updated: '',
      },
      // ################### MAYLON #######################
      // # Me ajudou no meu momento de vida mais baixo    #
      // # Ele resolveu meu ponto mais fraco, minha baixa #
      // # Obrigado meu dog Maylon! <3										#
      // ##################################################
      myLow: {
        maylonSimilarSpeech: [],
        speechRecognition: null,
        hasBeenCalled: false,
        startTimeout: null,
        currentText: '',
        overlay: false,
        listeningActions: false,
        history: [],
      },
    }),

    computed: {
      ...mapStores(useListsStore),
      lists() {
        return this.listsStores.lists
      },
      status() {
        return this.listsStores.status
      },
      currentList() {
        return this.listsStores.currentList
      },
      currentListTasks() {
        const currentListTasks = this.listsStores.currentListTasks

        if (!currentListTasks) return []

        return currentListTasks.map((i) => ({
          ...i,
          lastUpdatedDate: this.normalizeDatetime(i.date_updated),
        }))
      },
      currentTaskStatus() {
        if (!this.status.length) return '-'

        return this.status.find((i) => i.status == this.currentTask.status.status)?.name || '-'
      },
      currentTaskDateCreated() {
        if (!this.currentTask.date_created) return '-'

        const date = new Date(+this.currentTask.date_created)
        const hour = this.checkZero(date.getHours() + '')
        const minute = this.checkZero(date.getMinutes() + '')
        return `${hour}:${minute} ${date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`
      },
      currentTaskDateUpdated() {
        if (!this.currentTask.date_updated) return '-'

        const date = new Date(+this.currentTask.date_updated)
        const hour = this.checkZero(date.getHours() + '')
        const minute = this.checkZero(date.getMinutes() + '')
        return `${hour}:${minute} ${date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`
      },
      currentListLoading() {
        return this.listsStores.loading.currentList
      },
      currentListTasksLoading() {
        return this.listsStores.loading.currentListTasks
      },
      // filteredTodos: function () {
      // 	return filters[this.visibility](this.todos)
      // },
      // remaining: function () {
      // 	return filters.active(this.todos).length
      // },
    },
    methods: {
      checkZero(data) {
        if (data.length == 1) {
          data = '0' + data
        }
        return data
      },
      normalizeDatetime(datetime) {
        return new Intl.DateTimeFormat('pt-BR', this.timezoneOptions).format(datetime)
      },
      addTodo() {
        const value = this.newTodo && this.newTodo.trim()

        if (!value) return

        // const temp_uid = crypto.randomUUID()

        if (!this.currentList?.id) {
          this.showErrorMessage = true
          this.errorMessage = 'Selecione uma lista de tarefas'
          return
        }

        const listId = this.currentList.id

        const task = {
          // temp_uid,
          name: value,
          description: '123',
          status: 'backlog',
        }

        this.listsStores.requestAddTaskInList({ listId, task }).finally(() => (this.newTodo = ''))
      },

      removeTodo() {
        // this.todos.splice(this.todos.indexOf(todo), 1)
      },

      editTodo() {
        // this.beforeEditCache = todo.title
        // this.editedTodo = todo
      },

      doneEdit() {
        // if (!this.editedTodo) {
        // 	return
        // }
        // this.editedTodo = null
        // todo.title = todo.title.trim()
        // if (!todo.title) {
        // 	this.removeTodo(todo)
        // }
      },

      cancelEdit() {
        // this.editedTodo = null
        // todo.title = this.beforeEditCache
      },
      removeCompleted() {
        // this.todos = filters.active(this.todos)
      },
      openTaskDialog(item) {
        this.taskDialog = true
        this.currentTask = item
      },
      startRecognition() {
        console.log('Starting')
        this.isRecording = true
        // this.newTodoSpeechRecognition()
        this.recognition.start()
      },
      stopRecognition() {
        console.log('Stopping')
        this.isRecording = false
        this.recognition.stop()
        this.recognition = null
      },
      newTodoSpeechRecognition() {
        // this.recognition.onresult = function (event) {
        // 	var color = event.results[0][0].transcript
        // 	console.log('color: ', color)
        // }
      },
      // hasMyLow(text) {
      // 	myLowSimilarSpeech = ['myLow', 'mailon', 'maylom', 'mailom', 'nylon']
      // },
      startMyLow() {
        console.log('MyLow - Starting')
        this.resetMyLow()
        this.myLow.speechRecognition.start()

        // clearTimeout(this.myLow.startTimeout)
        // this.myLow.startTimeout = setTimeout(this.myLowTimeout, 100)
      },
      stopMyLow() {
        console.log('MyLow - STOP')

        if (this.myLow.speechRecognition) {
          // clearTimeout(this.myLow.startTimeout)
          this.myLow.speechRecognition.stop()
        }
      },
      resetMyLow() {
        clearTimeout(this.myLow.timeout)

        this.myLow.overlay = false
        this.myLow.currentText = ''
        this.myLow.hasBeenCalled = false
        this.myLow.listeningActions = false
      },
      myLowTimeout() {
        console.log('MyLow - timeout')

        if (this.myLow.speechRecognition) {
          this.myLow.speechRecognition.start()
        }
      },
      startSpeechRecognitionAPI() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition && 'development' !== 'production') {
          throw new Error(
            'Speech Recognition does not exist on this browser. Use Chrome or Firefox'
          )
        }

        if (!SpeechRecognition) {
          console.error('No Speech Recognition')
          return
        }

        const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList

        const grammar =
          '#JSGF V1.0; grammar colors; public <color> = myLow | myLow adicionar uma tarefa ' +
          '| myLow criar uma tarefa | myLow remover uma tarefa |' +
          this.myLow.maylonSimilarSpeech.join(' | ') +
          ';'
        console.log(grammar)
        this.speechRecognitionList = new SpeechGrammarList()
        this.speechRecognitionList.addFromString(grammar, 1)

        this.recognition = new SpeechRecognition()
        this.recognition.grammars = this.speechRecognitionList
        this.recognition.interimResults = true

        this.recognition.onresult = (event) => {
          console.log('[Recognition] result')
          this.newTodo = Array.from(event.results).reduce((acc, i) => acc + i[0].transcript, '')
          console.log('[Recognition] result: ', this.newTodo)
        }

        this.recognition.onend = () => {
          console.log('[Recognition] End')
          if (this.newTodo !== '') {
            this.addTodo()
            this.isRecording = false
            // TODO: validate event with @Rennan
            this.$emit('onTranscriptionEnd', {
              transcription: [this.newTodo],
              lastSentence: this.newTodo,
            })
          } else {
            console.log('[Recognition] End - Nothing Found')
          }
        }

        // this.speechRecognitionList = new SpeechGrammarList()
        // this.speechRecognitionList.addFromString(grammar, 1)

        this.myLow.speechRecognition = new SpeechRecognition()
        this.myLow.speechRecognition.grammars = this.speechRecognitionList
        this.myLow.speechRecognition.lang = 'pt-BR' // TODO: Fazer em pt-BR e outro ouvindo em en-US pra ver se captura mylon corretamente
        this.myLow.speechRecognition.interimResults = true
        this.myLow.speechRecognition.continuous = true
        this.myLow.speechRecognition.maxAlternatives = 1

        this.myLow.speechRecognition.onsoundstart = (event) => {
          const text = event
          console.log('[MyLow] soundstart: ' + text + ' - hasMaylow: ', event)
        }

        this.myLow.speechRecognition.onspeechstart = (event) => {
          const text = event
          console.log('[MyLow] speechstart: ' + text + ' - hasMaylow: ', event)
        }

        this.myLow.speechRecognition.onresult = (event) => {
          this.myLow.currentText = event.results[event.resultIndex][0].transcript
            .trim()
            .toLowerCase()

          console.log('[MyLow] result - enter: ', this.myLow.currentText)
          this.myLow.hasBeenCalled = this.myLow.maylonSimilarSpeech.some((i) =>
            this.myLow.currentText.includes(i)
          )

          if (this.myLow.hasBeenCalled) {
            console.log('[MyLow] result - mylow: ', this.myLow.currentText)
            !this.myLow.overlay && this.myLowShowUp()
            this.myLowActions(this.myLow.currentText)
          }
        }

        this.myLow.speechRecognition.onend = () => {
          if (this.myLow.currentText) {
            console.log('[MyLow] End: ', this.myLow.currentText)

            const newRegistry = {
              createdDate: new Date(),
              text: this.myLow.currentText,
              hasBeenCalled: this.myLow.hasBeenCalled || undefined,
            }

            this.myLow.history.push(newRegistry)

            const myLowSpeechHistory = JSON.parse(
              localStorage.getItem('myLowSpeechHistory') || '[]'
            )
            myLowSpeechHistory.push(newRegistry)
            localStorage.setItem('myLowSpeechHistory', JSON.stringify(myLowSpeechHistory))

            this.resetMyLow()

            this.myLow.timeout = setTimeout(this.myLowTimeout, 2000)
          }
        }

        // listeningActions
        this.startMyLow()
        // this.myLow.speechRecognition.addEventListener('result', event => {
        // 	clearTimeout(this.myLow.startTimeout)

        // 	this.myLow.currentText = Array.from(event.results)
        // 		.reduce((acc, i) => acc + i[0].transcript, '')
        // 		.toLowerCase()

        // 	console.log('[MyLow] result: ', this.myLow.currentText)

        // 	this.myLow.hasBeenCalled = maylonSimilarSpeech.some(i => this.myLow.currentText.includes(i))
        // 	// console.log('[MyLow] result: ', this.myLow.currentText)
        // })

        // this.myLow.speechRecognition.addEventListener('end', () => {
        // 	this.stopMyLow()

        // 	if (this.myLow.currentText) {
        // 		console.log('[MyLow] End: ', this.myLow.currentText)

        // 		const newRegistry = {
        // 			createdDate: new Date(),
        // 			text: this.myLow.currentText,
        // 			hasBeenCalled: this.myLow.hasBeenCalled || undefined,
        // 		}

        // 		this.myLow.history.push(newRegistry)

        // 		const myLowSpeechHistory = JSON.parse(localStorage.getItem('myLowSpeechHistory') || '[]')
        // 		myLowSpeechHistory.push(newRegistry)
        // 		localStorage.setItem('myLowSpeechHistory', JSON.stringify(myLowSpeechHistory))

        // 		if (this.myLow.hasBeenCalled) {
        // 			this.myLowActions(this.myLow.currentText)
        // 		}
        // 	}
        // 	this.startMyLow()
        // })
        // this.startMyLow()
      },
      myLowActions(text) {
        if (['adicionar', 'tarefa'].every((i) => text.includes(i))) {
          this.myLow.currentText = '[ALERTA] - Maylon adicionando uma tarefa'
          console.log(this.myLow.currentText)
        }
        if (['remover', 'tarefa'].every((i) => text.includes(i))) {
          this.myLow.currentText = '[ALERTA] - Maylon removendo uma tarefa'
          console.log(this.myLow.currentText)
        }
      },
      myLowShowUp() {
        this.myLow.overlay = true
      },
    },

    mounted() {
      // this.startSpeechRecognitionAPI()	ROLLBACK: disable this line
      console.log('Home: startTimeout: ', this.startTimeout)
    },

    beforeDestroy() {
      this.stopMyLow()
      this.myLow = {
        speechRecognition: null,
        history: [],
        currentText: '',
        hasBeenCalled: false,
        cancelTimeout: null,
        maylonSimilarSpeech: [],
      }
    },
  }
</script>

<style lang="scss" scoped>
  .maylon-on:after {
    content: ' .';
    font-size: 1.4em;
    animation: dots 1s steps(5, end) infinite;
  }

  @keyframes dots {
    0%,
    10% {
      color: rgba(0, 0, 0, 0);
      text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
    }
    30% {
      color: white;
      text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
    }
    60% {
      text-shadow: 0.25em 0 0 white, 0.5em 0 0 rgba(0, 0, 0, 0);
    }
    80%,
    100% {
      text-shadow: 0.25em 0 0 white, 0.5em 0 0 white;
    }
  }
</style>
