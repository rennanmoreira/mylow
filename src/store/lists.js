import { defineStore } from 'pinia'
import * as services from '../services/lists'

const menuOptions = [
  {
    spaceName: 'Início',
    routeName: 'home',
    spaceId: '',
    listId: '',
    icon: 'mdi-home',
  },
  {
    spaceName: 'Cannan',
    routeName: 'cannan',
    spaceId: '54979592',
    listId: '187027411',
    icon: '',
  },
  {
    spaceName: 'Trabalho',
    routeName: 'trabalho',
    spaceId: '54979629',
    listId: '187027604',
    icon: 'mdi-account',
  },
  {
    spaceName: 'Vida',
    routeName: 'life',
    spaceId: '54979652',
    listId: '187027714',
    icon: '',
  },
  {
    spaceName: 'Musica',
    routeName: 'music',
    spaceId: '54979654',
    listId: '187027729',
    icon: '',
  },
  {
    spaceName: 'Eureka',
    routeName: 'eureka',
    spaceId: '54979656',
    listId: '187027735',
    icon: '',
  },
  {
    spaceName: 'Casa',
    routeName: 'casa',
    spaceId: '49079524',
    listId: '', // TODO: Tem varias listas (Compras da casa, tarefas gerais e tarefas routineiras)
    icon: '',
  },
  {
    spaceName: 'Luna',
    routeName: 'luna',
    spaceId: '54979662',
    listId: '187027745',
    icon: '',
  },
  {
    spaceName: 'Grow',
    routeName: 'grow',
    spaceId: '54979665',
    listId: '187027758',
    icon: '',
  },
  {
    spaceName: 'Organização Muda',
    routeName: 'muda',
    spaceId: '54979681',
    listId: '187027805',
    icon: '',
  },
  {
    spaceName: 'Tarefas em geral',
    routeName: 'general-tasks',
    spaceId: '55020473',
    listId: '192910044',
    icon: 'mdi-account',
  },
]

const generalStatus = [
  {
    // id: "p55020473_6Od6oDAd",
    status: 'backlog',
    order: 0,
    color: '#d3d3d3',
    type: 'open',
    name: 'Listado',
  },
  {
    // id: "p55020473_pAkDy1IU",
    status: 'working',
    order: 1,
    color: '#f9d900',
    type: 'custom',
    name: 'Trabalhando',
  },
  {
    // id: "p55020473_rcH7ZO1e",
    status: 'stopped',
    order: 2,
    color: '#02BCD4',
    type: 'custom',
    name: 'Parado',
  },
  {
    // id: "p55020473_0Hdw7jJs",
    status: 'completed',
    order: 3,
    color: '#6bc950',
    type: 'closed',
    name: 'Finalizado',
  },
]

export const useListsStore = defineStore('lists', {
  state: () => ({
    lists: [],
    menuOptions,
    currentList: null,
    currentMenuIndex: 0,
    currentListTasks: [],
    status: generalStatus,
    loading: {
      lists: false,
      currentList: false,
      currentListTasks: false,
    },
  }),
  getters: {
    currentMenu: (state) => state.menuOptions[state.currentMenuIndex],
  },
  actions: {
    // Old mutations
    RESET_STATE() {
      this.$reset
    },
    SET_LISTS: (lists) => {
      this.lists = lists
    },
    ADD_LIST: (list) => {
      this.lists.push(list) // TODO: Verificar se esta salvando e propagando corretamente
    },
    SET_CURRENT_LIST: (list) => {
      this.currentList = list
    },
    SET_CURRENT_LIST_TASKS: (tasks) => {
      this.currentListTasks = tasks
    },
    ADD_TASK_TO_CURRENT_LIST: (task) => {
      this.currentListTasks.push(task)
    },
    SET_CURRENT_LIST_TASKS_REQUEST: ({ tasks }) => {
      this.currentListTasks = tasks
    },
    SET_CURRENT_MENU_INDEX: (index) => {
      this.currentMenuIndex = index
    },
    CLEAN_CURRENT_LIST: () => {
      Object.assign(this.currentList, null)
      Object.assign(this.currentListTasks, [])
    },
    START_LOADING: (property) => {
      this.loading[property] = true
    },
    STOP_LOADING: (property) => {
      this.loading[property] = false
    },

    // Actions

    serviceRequest: ({ service, data, mutation, loading = '', empty = undefined }) => {
      loading && this.START_LOADING(loading)
      empty !== undefined && window[mutation](empty)

      return services[service](data)
        .then((res) => {
          mutation && window[mutation](res.data)
          return Promise.resolve(res)
        })
        .catch((error) => {
          console.error(`[MYLOW] Erro no serviço ${service}`, error)
          return Promise.reject(error)
        })
        .finally(() => loading && this.STOP_LOADING(loading))
    },
    requestGetList: (listId) => {
      this.serviceRequest({
        data: listId,
        empty: [],
        service: 'getListTasks',
        loading: 'currentListTasks',
        mutation: 'SET_CURRENT_LIST_TASKS_REQUEST',
      })

      return this.serviceRequest({
        data: listId,
        empty: null,
        service: 'getList',
        loading: 'currentList',
        mutation: 'SET_CURRENT_LIST',
      })
    },
    requestAddTaskInList: ({ listId, task }) =>
      this.serviceRequest({
        data: { listId, task },
        service: 'addTaskInList',
        loading: 'currentListTasks',
        mutation: 'ADD_TASK_TO_CURRENT_LIST',
      }).then(async (res) => {
        if (res.status < 200 || res.status > 299) return Promise.reject(res)
        let receivedWithNewTask = false
        do {
          receivedWithNewTask = await this.serviceRequest({
            data: listId,
            service: 'getListTasks',
            loading: 'currentListTasks',
          }).then(({ data }) => {
            if (!data.tasks.find((i) => i.id === res.data.id)) return false
            this.SET_CURRENT_LIST_TASKS_REQUEST(data)
            return true
          })
        } while (!receivedWithNewTask)
      }),
  },
})
