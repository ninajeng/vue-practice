const { createApp } = Vue

const app = createApp({
    data(){
        return{
            products: {},
            temp: {},
            BASE_URL: 'https://ec-course-api.hexschool.io/',
            CHECK_PATH: 'v2/api/user/check',
            GETDATA_PATH: 'v2/api/vegetableshop/admin/products'
        }
    },
    methods: {
      checkAuth(){
        const token = document.cookie.replace(
          /(?:(?:^|.*;\s*)VegetableShopToken\s*\=\s*([^;]*).*$)|^.*$/,
          "$1",
        );
        axios.defaults.headers.common.Authorization = token
        axios.post(`${this.BASE_URL}${this.CHECK_PATH}`).then(res => {
          if(!res.data.success) {
            alert(res.data.message)
            location.replace('./login.html')
          }else{
            this.getData()
          }
        }).catch(e => {
          alert(e.response.data.message)
          location.replace('./login.html')
        })
      },
      getData(){
        axios.get(`${this.BASE_URL}${this.GETDATA_PATH}`)
        .then(res => {
          if(res.data.success){
            this.products = res.data.products
          }else{
            alert(res.data.message)
          }
        }).catch(e => alert(e.response.data.message))
      }
    },
    created(){
      this.checkAuth()
    }
})

app.mount('#app')
