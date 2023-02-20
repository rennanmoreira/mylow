<script setup>
  import { useListsStore } from './store/lists'
  import { router } from './router/index'
  import { ref, computed } from 'vue'

  const  drawer= ref(false),
  const  fab= ref(false),
  const store = useListsStore()
  const currentMenu = computed(() => store.getters['currentMenu'])
  const currentListSpaceName = computed(()=> currentMenu?.spaceName)
  const currentMenuIndex = computed({
      get() {
        return store.currentMenuIndex
      },
      set(value) {
        store.SET_CURRENT_MENU_INDEX(value)
        const listId = store.menuOptions[value].listId
        listId && store.requestGetList(listId)
        drawer.value = false
        // router.push({ name: 'home' }) // TODO: finalizar navegacao rotas
      },
    })
  }
</script>

<template>
  <v-app>
    <div class="overflow-hidden">
      <v-app-bar app color="indigo darken-4" dark>
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

        <v-toolbar-title>{{ currentListSpaceName }}</v-toolbar-title>

        <!-- <v-btn icon>
					<v-icon>mdi-magnify</v-icon>
				</v-btn> -->

        <v-spacer></v-spacer>
        <!--
				<v-btn icon>
					<v-icon>mdi-plus-circle-outline</v-icon>
				</v-btn> -->

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer app v-model="drawer" temporary>
        <v-list nav dense>
          <v-list-item-group v-model="currentMenuIndex" active-class="indigo--text text--accent-4">
            <v-list-item v-for="option in store.menuOptions" :key="option.spaceId">
              <v-list-item-icon>
                <v-icon>{{ option.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ option.spaceName }}</v-list-item-title>
            </v-list-item>
            <!--
						<v-list-item>
							<v-list-item-icon>
								<v-icon>mdi-account</v-icon>
							</v-list-item-icon>
							<v-list-item-title>Outros</v-list-item-title>
						</v-list-item> -->
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <router-view />
      </v-main>
      <!-- text-box-plus
	microphone-plus
	plus-circle-outline
	plus-thick -->
      <v-speed-dial
        fixed
        v-model="fab"
        :bottom="true"
        :right="true"
        direction="top"
        transition="slide-y-reverse-transition">
        <template v-slot:activator>
          <v-btn v-model="fab" color="indigo darken-4" dark fab>
            <v-icon :class="{ 'rotate-45': !fab }"> mdi-close </v-icon>
          </v-btn>
        </template>
        <v-btn fab dark small color="indigo darken-1" class="invert-image">
          <v-icon>mdi-text-box-plus</v-icon>
        </v-btn>
        <v-btn fab dark small color="indigo darken-1">
          <v-icon>mdi-microphone-plus</v-icon>
        </v-btn>
      </v-speed-dial>
    </div>
  </v-app>
</template>

<style scoped>
  .rotate-45 {
    transform: rotate(45deg);
  }

  .invert-image {
    transform: scaleY(-1);
  }
</style>
