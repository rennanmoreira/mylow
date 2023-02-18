// ############### MAYLON (MyLow) ###################
// # Me ajudou no meu momento de vida mais baixo    #
// # Ele resolveu meu ponto mais fraco, minha baixa #
// # Obrigado meu dog Maylon! <3										#
// ##################################################

const maylonSimilarSpeech = ['maylow', 'maylou', 'mailou', 'maylon', 'mailon', 'maylom', 'mailom', 'nylon', 'maicon', 'maikon', 'maillot', 'mário', 'mario', 'milo', 'milu', 'my low', 'mine low', 'marlon', 'mas vou', 'mais ou', 'mais algum', 'mais na', 'maior', 'marido', 'maiô', 'maio', 'maria', 'marli', 'miley']

export default {
	// eslint-disable-next-line no-unused-vars
	install(Vue, options) {
		Vue.mixin({
			name: 'MyLow',
			data: () => ({
				maylonSimilarSpeech,
				speechRecognition: null,
				hasBeenCalled: false,
				startTimeout: 3,
				currentText: '+1',
				overlay: false,
				listeningActions: false,
				history: [],
			}),
			created() {
				this.startTimeout++
				console.log('MyLow: created')
				console.log('MyLow: starting speech recognition: ',this.startTimeout)
				// this.startSpeechRecognitionAPI()
			}
		})
		// 1. adicionar método ou propriedade global
		Vue.speechRecognition = null
		Vue.hasBeenCalled = null
		Vue.startTimeout = null
		Vue.currentText = null
		Vue.overlay = null
		Vue.overlap = null
		Vue.listeningActions = null
		Vue.history = null
		// alguma lógica ...
		// }

		// // 2. adicionar um recurso global
		// Vue.directive('my-directive', {
		// 	bind (el, binding, vnode, oldVnode) {
		// 		// alguma lógica ...
		// 	}
		// })

		// // 3. adicionar algumas opções de componente
		// Vue.mixin({
		// 	created: function () {
		// 		// alguma lógica ...
		// 	}
		// })

		// // 4. adicionar um método de instância
		// Vue.prototype.$myMethod = function (methodOptions) {
		// 	// alguma lógica ...
		// }
	}
}