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
            productModal: null,
            requiredData: [
                'title',
                'category',
                'unit',
                'origin_price',
                'price'
            ],
            formInvalidate: [],
            BASE_URL: 'https://ec-course-api.hexschool.io/',
            CHECK_PATH: 'v2/api/user/check',
            PRODUCT_PATH: 'v2/api/vegetableshop/admin/product',
            isLoading: false
        }
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
        this.formInvalidate = []
        this.tempProduct = { ...data }
        if (!Array.isArray(this.tempProduct.imagesUrl)){
          this.tempProduct.imagesUrl = []
        }
        this.productModal.show()
      },
      updateProduct(product){
        this.formInvalidate = []
        this.requiredData.forEach(item => {
            if (!product[item]) this.formInvalidate.push(item)
        })
        if (this.formInvalidate.length) {
            return
        }
        this.isLoading = true
        if (product.imagesUrl?.length) {
          product.imagesUrl = product.imagesUrl.filter(url => url !== '')
        }
        const HTTPMETHOD = product.id ? 'put' : 'post'
        const PATH = `${this.PRODUCT_PATH}${product.id ? `/${product.id}` : ''}`
        axios[HTTPMETHOD](`${this.BASE_URL}${PATH}`, { data: product })
          .then(res => {
            this.productModal.hide()
            this.showSuccessAlert(res.data.message)
            this.getData()
          }).catch(e => {
            this.isLoading = false
            alert(e.response.data.message)
          })
      },
      deleteConfirm(product){
        Swal.fire({
          title: `刪除 "${product.title}" 產品?`,
          text: "刪除後將無法恢復",
          icon: "warning",
          confirmButtonColor: "#dc3545",
          confirmButtonText: "刪除",
          showCancelButton: true,
          cancelButtonText: "取消",
        }).then((result) => {
          if (result.isConfirmed) {
            this.deleteProduct(product.id)
          }
        });
      },
      deleteProduct(id){
        this.isLoading = true
        axios.delete(`${this.BASE_URL}${this.PRODUCT_PATH}/${id}`)
        .then(res => {
          this.showSuccessAlert(res.data.message)
          this.getData()
        }).catch(e => {
          this.isLoading = false
          alert(e.response.data.message)
        })
      },
      showSuccessAlert(title){
        Swal.fire({
          title,
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });
      },
      setPage(page){
        this.nowPage = page
        this.getData()
      },
      validate(data){
        return this.formInvalidate.indexOf(data) > -1 ? true : false
      },
      removeError(data){
          const index = this.formInvalidate.indexOf(data)
          if(index > -1){
              this.formInvalidate.splice(index, 1)
          }
      }
    },
    created(){
      this.checkAuth()
    },
    mounted(){
        this.productModal = new bootstrap.Modal(this.$refs.modal, {
            backdrop: 'static'
          })
        new bootstrap.Popover(this.$refs.popover, {
            container: '.modal-body'
          })
    }
})
app.use(VueLoading.LoadingPlugin);
app.component('loadingView', VueLoading.Component)
app.mount('#app')
