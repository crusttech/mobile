import Router from 'corteza-webapp-messaging/node_modules/vue-router'
import messagingRoutes from 'corteza-webapp-messaging/src/views/routes'
import authRoutes from 'corteza-webapp-auth/src/views/routes'

function view (name, resolve) {
  return function (resolve) {
    return require([`./views/${name}.vue`], resolve)
  }
}

// Remove old auth routes
const routes = messagingRoutes.filter(r => r.name !== 'auth')

export default new Router({
  base: '',
  mode: 'history',
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: view('Auth'),
      children: [
        ...authRoutes.map(r => ({ ...r, path: r.path.slice(1) })),
      ],
    },
    {
      path: '/configure',
      name: 'configure',
      component: view('Configure'),
    },
    ...routes,
  ],
})
