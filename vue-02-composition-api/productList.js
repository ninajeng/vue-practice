const { createApp, ref, onBeforeMount } = Vue

const app = createApp({
  setup(){
    const products = ref({})
    const tempProduct = ref({})
    const BASE_URL = 'https://ec-course-api.hexschool.io/'
    const CHECK_PATH = 'v2/api/user/check'
    const GETDATA_PATH = 'v2/api/vegetableshop/admin/products'

    const checkAuth = () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)VegetableShopToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
      axios.defaults.headers.common.Authorization = token
      axios.post(`${BASE_URL}${CHECK_PATH}`).then(res => {
        if(!res.data.success) {
          alert(res.data.message)
          location.replace('./login.html')
        }else{
          getData()
        }
      }).catch(e => {
        alert(e.response.data.message)
        location.replace('./login.html')
      })
    }

    const getData = () => {
      axios.get(`${BASE_URL}${GETDATA_PATH}`)
      .then(res => {
        if(res.data.success){
          products.value = res.data.products
        }else{
          alert(res.data.message)
        }
      }).catch(e => alert(e.response.data.message))
    }

    onBeforeMount(() => {
      checkAuth()
    })

    return{
      products, tempProduct
    }
  }
})

app.mount('#app')
