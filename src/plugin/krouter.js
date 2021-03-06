let Vue

class KVueRouter {
  constructor (options) {
    this.$options = options

    Vue.util.defineReactive(this, 'current', '/')

    // 监控url的变化
    window.addEventListener('hashchange', this.onHashChange.bind(this))

    window.addEventListener('load', this.onHashChange.bind(this))

    // 创建一个路由映射表
    this.routeMap = {}
    options.routes.forEach(route => {
      this.routeMap[route.path] = route
    })
  }

  onHashChange () {
    this.current = window.location.hash.slice(1)
  }
}

KVueRouter.install = _Vue => {
  // 保存构建函数在Krouter中使用
  Vue = _Vue

  // 挂载$router
  Vue.mixin({
    beforeCreate () {
      // 确保根实例的时候才触发
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    }
  })

  // 创建全局组件router-link和router-view
  // 开发组件是得使用render函数不能使用template
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    render (h) {
      return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
    }
  })

  Vue.component('router-view', {
    render (h) {
      // 获取path对应的component
      const { routeMap, current } = this.$router
      const component = routeMap[current].component || null
      return h(component)
    }
  })
}

export default KVueRouter
