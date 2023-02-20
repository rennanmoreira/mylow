<script setup>
  import { useListsStore } from '../store/lists'
  import { ref, computed, onMounted, onBeforeMount } from 'vue'

  // ################### MAYLON #######################
  // # Me ajudou no meu momento de vida mais baixo    #
  // # Ele resolveu meu ponto mais fraco, minha baixa #
  // # Obrigado meu dog Maylon! <3										#
  // ##################################################
  const myLow = ref({
    maylonSimilarSpeech: [],
    speechRecognition: null,
    hasBeenCalled: false,
    startTimeout: null,
    currentText: '',
    overlay: false,
    listeningActions: false,
    history: [],
  })
  const selected = ref([])
  const timezoneOptions = ref({
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  })
  const todo = ref({})
  const todos = ref([])
  const newTodo = ref('') // TODO: Tranformar em objeto (todo) para usar novas props
  const showErrorMessage = ref(false)
  const errorMessage = ref('')
  const editedTodo = ref(null)
  const visibility = ref('all')
  const recognition = ref(null)
  const speechRecognitionList = ref(null)
  const isRecording = ref(false)
  const taskDialog = ref(false)
  const currentTask = ref({
    id: '',
    name: '',
    description: '',
    status: '',
    date_created: '',
    date_updated: '',
  })
  const store = useListsStore()

  const currentListTasks = computed(() => {
    const currentListTasks = store.currentListTasks
    if (!currentListTasks) return []
    return currentListTasks.map((i) => ({
      ...i,
      lastUpdatedDate: this.normalizeDatetime(i.date_updated),
    }))
  })

  // const filteredTodos = computed(() => filters[visibility.value](todos.value))
  // const remaining = computed(() => filters.active(todos.value).length)

  const normalizeDatetime = (datetime) =>
    new Intl.DateTimeFormat('pt-BR', timezoneOptions.value).format(datetime)
  const checkZero = (data) => {
    if (data.length == 1) {
      data = '0' + data
    }
    return data
  }

  const currentTaskStatus = () => {
    if (store.status.length) return '-'
    return store.status.find((i) => i.status == currentTask.value.status)?.name || '-'
  }

  const currentTaskDateCreated = () => {
    if (currentTask.value.date_created) return '-'
    const date = new Date(currentTask.value.date_created)
    const hour = checkZero(date.getHours() + '')
    const minute = checkZero(date.getMinutes() + '')
    return `${hour}:${minute} ${date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`
  }

  const currentTaskDateUpdated = () => {
    if (currentTask.value.date_updated) return '-'

    const date = new Date(currentTask.value.date_updated)
    const hour = checkZero(date.getHours() + '')
    const minute = checkZero(date.getMinutes() + '')
    return `${hour}:${minute} ${date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`
  }

  const currentListLoading = () => store.loading.currentList

  const currentListTasksLoading = () => store.loading.currentListTasks

  const addTodo = () => {
    const value = newTodo.value && newTodo.value.trim()
    if (!value) return

    // const temp_uid = crypto.randomUUID()

    if (currentList.value?.id) {
      showErrorMessage.value = true
      errorMessage.value = 'Selecione uma lista de tarefas'
      return
    }

    const listId = currentList.value.id

    const task = {
      // temp_uid,
      name: value,
      description: '123',
      status: 'backlog',
    }

    store.requestAddTaskInList({ listId, task }).finally(() => (newTodo.value = ''))
  }

  const removeTodo = () => {
    // todos.value.splice(todos.value.indexOf(todo), 1)
  }

  const editTodo = () => {
    // beforeEditCache.value = todo.title
    // editedTodo = todo.value
  }

  const doneEdit = () => {
    // if (!editedTodo.value) {
    // 	return
    // }
    // editedTodo.value = null
    // todo.title = todo.title.trim()
    // if (!todo.title) {
    // 	removeTodo(todo)
    // }
  }

  const cancelEdit = () => {
    // editedTodo.value = null
    // todo.title = beforeEditCache.value
  }
  const removeCompleted = () => {
    // todos.value = filters.active(todos.value)
  }

  const openTaskDialog = (item) => {
    taskDialog.value = true
    currentTask.value = item
  }
  const startRecognition = () => {
    console.log('Starting')
    isRecording.value = true
    // newTodoSpeechRecognition()
    recognition.start()
  }

  const stopRecognition = () => {
    console.log('Stopping')
    isRecording.value = false
    recognition.stop()
    recognition.value = null
  }
  const newTodoSpeechRecognition = () => {
    // recognition.onresult = (event) => {
    // 	const color = event.results[0][0].transcript
    // 	console.log('color: ', color)
    // }
  }
  // hasMyLow(text) {
  // 	myLowSimilarSpeech = ['myLow', 'mailon', 'maylom', 'mailom', 'nylon']
  // },
  const startMyLow = () => {
    console.log('MyLow - Starting')
    resetMyLow()
    myLow.speechRecognition.start()

    // clearTimeout(myLow.startTimeout)
    // myLow.value.startTimeout = setTimeout(myLowTimeout, 100)
  }
  const stopMyLow = () => {
    console.log('MyLow - STOP')

    if (this.myLow.speechRecognition) {
      // clearTimeout(myLow.startTimeout)
      this.myLow.speechRecognition.stop()
    }
  }
  const resetMyLow = () => {
    clearTimeout(myLow.timeout)

    myLow.overlay = false
    myLow.currentText = ''
    myLow.hasBeenCalled = false
    myLow.listeningActions = false
  }
  const myLowTimeout = () => {
    console.log('MyLow - timeout')

    if (myLow.speechRecognition) {
      myLow.speechRecognition.start()
    }
  }

  const myLowActions = (text) => {
    if (['adicionar', 'tarefa'].every((i) => text.includes(i))) {
      myLow.currentText = '[ALERTA] - Maylon adicionando uma tarefa'
      console.log(myLow.currentText)
    }
    if (['remover', 'tarefa'].every((i) => text.includes(i))) {
      myLow.currentText = '[ALERTA] - Maylon removendo uma tarefa'
      console.log(myLow.currentText)
    }
  }

  const myLowShowUp = () => (myLow.overlay = true)

  const startSpeechRecognitionAPI = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition && 'development' !== 'production') {
      throw new Error('Speech Recognition does not exist on this browser. Use Chrome or Firefox')
    }

    if (!SpeechRecognition) {
      console.error('No Speech Recognition')
      return
    }

    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList

    const grammar =
      '#JSGF V1.0; grammar colors; public <color> = myLow | myLow adicionar uma tarefa ' +
      '| myLow criar uma tarefa | myLow remover uma tarefa |' +
      myLow.maylonSimilarSpeech.join(' | ') +
      ';'
    console.log(grammar)

    speechRecognitionList.value = new SpeechGrammarList()
    speechRecognitionList.addFromString(grammar, 1)

    recognition.value = new SpeechRecognition()
    recognition.grammars = speechRecognitionList.value
    recognition.interimResults = true

    recognition.onresult = ({ results }) => {
      console.log('[Recognition] result')
      newTodo.value = Array.from(results).reduce((acc, i) => acc + i[0].transcript, '')
      console.log('[Recognition] result: ', newTodo.value)
    }

    recognition.onend = () => {
      console.log('[Recognition] End')
      if (newTodo.value !== '') {
        addTodo()
        isRecording.value = false
        // TODO: validate event with @Rennan
        this.$emit('onTranscriptionEnd', {
          transcription: [newTodo.value],
          lastSentence: newTodo.value,
        })
      } else {
        console.log('[Recognition] End - Nothing Found')
      }
    }

    // speechRecognitionList.value = new SpeechGrammarList()
    // speechRecognitionList.addFromString(grammar, 1)

    myLow.speechRecognition = new SpeechRecognition()
    myLow.speechRecognition.grammars = speechRecognitionList.value
    myLow.speechRecognition.lang = 'pt-BR' // TODO: Fazer em pt-BR e outro ouvindo em en-US pra ver se captura mylon corretamente
    myLow.speechRecognition.interimResults = true
    myLow.speechRecognition.continuous = true
    myLow.speechRecognition.maxAlternatives = 1

    myLow.speechRecognition.onsoundstart = (event) => {
      const text = event
      console.log('[MyLow] soundstart: ' + text + ' - hasMaylow: ', event)
    }

    myLow.speechRecognition.onspeechstart = (event) => {
      const text = event
      console.log('[MyLow] speechstart: ' + text + ' - hasMaylow: ', event)
    }

    myLow.speechRecognition.onresult = (event) => {
      myLow.currentText = event.results[event.resultIndex][0].transcript.trim().toLowerCase()

      console.log('[MyLow] result - enter: ', myLow.currentText)
      myLow.hasBeenCalled = myLow.maylonSimilarSpeech.some((i) => myLow.currentText.includes(i))

      if (myLow.hasBeenCalled) {
        console.log('[MyLow] result - mylow: ', myLow.currentText)
        !myLow.overlay && myLowShowUp()
        myLowActions(myLow.currentText)
      }
    }

    myLow.speechRecognition.onend = () => {
      if (myLow.currentText) {
        console.log('[MyLow] End: ', myLow.currentText)

        const newRegistry = {
          createdDate: new Date(),
          text: myLow.currentText,
          hasBeenCalled: myLow.hasBeenCalled || undefined,
        }

        myLow.history.push(newRegistry)

        const myLowSpeechHistory = JSON.parse(localStorage.getItem('myLowSpeechHistory') || '[]')
        myLowSpeechHistory.push(newRegistry)
        localStorage.setItem('myLowSpeechHistory', JSON.stringify(myLowSpeechHistory))

        resetMyLow()

        myLow.timeout = setTimeout(myLowTimeout(), 2000)
      }
    }

    // listeningActions
    startMyLow()
    // myLow.speechRecognition.addEventListener('result', event => {
    // 	clearTimeout(myLow.startTimeout)

    // 	myLow.currentText = Array.from(event.results)
    // 		.reduce((acc, i) => acc + i[0].transcript, '')
    // 		.toLowerCase()

    // 	console.log('[MyLow] result: ', myLow.currentText)

    // 	myLow.hasBeenCalled = maylonSimilarSpeech.some(i => myLow.currentText.includes(i))
    // 	// console.log('[MyLow] result: ', myLow.currentText)
    // })

    // myLow.speechRecognition.addEventListener('end', () => {
    // 	stopMyLow()

    // 	if (myLow.currentText) {
    // 		console.log('[MyLow] End: ', myLow.currentText)

    // 		const newRegistry = {
    // 			createdDate: new Date(),
    // 			text: myLow.currentText,
    // 			hasBeenCalled: myLow.hasBeenCalled || undefined,
    // 		}

    // 		myLow.history.push(newRegistry)

    // 		const myLowSpeechHistory = JSON.parse(localStorage.getItem('myLowSpeechHistory') || '[]')
    // 		myLowSpeechHistory.push(newRegistry)
    // 		localStorage.setItem('myLowSpeechHistory', JSON.stringify(myLowSpeechHistory))

    // 		if (myLow.hasBeenCalled) {
    // 			myLowActions(myLow.currentText)
    // 		}
    // 	}
    // 	startMyLow()
    // })
    // startMyLow()
  }

  onMounted(() => {
    // startSpeechRecognitionAPI()	ROLLBACK: disable this line
    console.log('Home: startTimeout: ', startTimeout.value)
  })

  onBeforeMount(() => {
    stopMyLow()
    myLow.value = {
      speechRecognition: null,
      history: [],
      currentText: '',
      hasBeenCalled: false,
      cancelTimeout: null,
      maylonSimilarSpeech: [],
    }
  })
</script>

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
