import ProductModal from "./Components/ProductModal.js";
import DeleteModal from "./Components/DeleteModal.js";
import PaginationComponent from "./Components/PaginationComponent.js";
import SuccessAlert from "./Components/SuccessAlert.js";

const { createApp } = Vue

const app = createApp({
    data(){
        return{
            products: {},
            tempProduct: {
              imagesUrl: []
            },
            pagination: {},
            nowPage: 1,
            BASE_URL: 'https://ec-course-api.hexschool.io/',
            CHECK_PATH: 'v2/api/user/check',
            PRODUCT_PATH: 'v2/api/vegetableshop/admin/product',
            isLoading: false
        }
    },
    components: {
      ProductModal,
      DeleteModal,
      PaginationComponent,
      SuccessAlert
    },
    methods: {
      checkAuth(){
        this.isLoading = true
        const token = document.cookie.replace(
          /(?:(?:^|.*;\s*)VegetableShopToken\s*\=\s*([^;]*).*$)|^.*$/,
          "$1",
        );
        axios.defaults.headers.common.Authorization = token
        axios.post(`${this.BASE_URL}${this.CHECK_PATH}`).then(res => {
          if(!res.data.success) {
            alert(res.data.message)
            this.isLoading = false
            location.replace('./login.html')
          }else{
            this.getData()
          }
        }).catch(e => {
          alert(e.response.data.message)
          this.isLoading = false
          location.replace('./login.html')
        })
      },
      getData(){
        this.isLoading = true
        axios.get(`${this.BASE_URL}${this.PRODUCT_PATH}s?page=${this.nowPage}`)
        .then(res => {
          if(res.data.success){
            this.pagination = res.data.pagination
            this.products = res.data.products
            this.isLoading = false
          }else{
            alert(res.data.message)
          }
        }).catch(e => alert(e.response.data.message))
      },
      editProduct(data = {}){
        this.tempProduct = { ...data }
        if (!Array.isArray(this.tempProduct.imagesUrl)){
          this.tempProduct.imagesUrl = []
        }
        this.$refs.ProductModal.show()
      },
      updateProduct(product){
        this.isLoading = true
        if (product.imagesUrl?.length) {
          product.imagesUrl = product.imagesUrl.filter(url => url !== '')
        }
        const HTTPMETHOD = product.id ? 'put' : 'post'
        const PATH = `${this.PRODUCT_PATH}${product.id ? `/${product.id}` : ''}`
        axios[HTTPMETHOD](`${this.BASE_URL}${PATH}`, { data: product })
          .then(res => {
            this.$refs.ProductModal.hide()
            this.$refs.SuccessAlert.show(res.data.message)
            this.getData()
          }).catch(e => {
            this.isLoading = false
            alert(e.response.data.message)
            console.log(e.response.data.message)
            this.formInvalidate = e.response.data.message
          })
      },
      deleteConfirm(data){
        this.$refs.DeleteModal.show(data)
      },
      deleteProduct(id){
        this.isLoading = true
        axios.delete(`${this.BASE_URL}${this.PRODUCT_PATH}/${id}`)
        .then(res => {
          this.$refs.SuccessAlert.show(res.data.message)
          this.getData()
        }).catch(e => {
          this.isLoading = false
          alert(e.response.data.message)
        })
      },
      setPage(page){
        this.nowPage = page
        this.getData()
      }
    },
    created(){
      this.checkAuth()
    },
    template: '#productListView'
})
app.use(VueLoading.LoadingPlugin);
app.component('loadingView', VueLoading.Component)
app.mount('#app')
