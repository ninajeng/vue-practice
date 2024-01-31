const { createApp, ref, onMounted } = Vue

const app = createApp({
  setup(){
    const products = ref({})
    const tempProduct = ref({
      imagesUrl: []
    })
    const formInvalidate = ref([])
    const requiredData = [
      'title',
      'category',
      'unit',
      'origin_price',
      'price'
    ]
    const modal = ref(null)  //$refs
    const popover = ref(null)  //$refs
    const productModal = ref(null)
    const nowPage = ref(1)
    const pagination = ref({})

    const isLoading = ref(false)
    const BASE_URL = 'https://ec-course-api.hexschool.io/'
    const CHECK_PATH = 'v2/api/user/check'
    const PRODUCT_PATH = 'v2/api/vegetableshop/admin/product'

    const checkAuth = () => {
      isLoading.value = true
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)VegetableShopToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
      axios.defaults.headers.common.Authorization = token
      axios.post(`${BASE_URL}${CHECK_PATH}`).then(res => {
        if(!res.data.success) {
          showErrorAlert(res.data.message, './login.html')
        }else{
          getData()
        }
      }).catch(e => {
        showErrorAlert(e.response.data.message, './login.html')
      })
    }

    const getData = () => {
      isLoading.value = true
      axios.get(`${BASE_URL}${PRODUCT_PATH}s?page=${nowPage.value}`)
      .then(res => {
        if(res.data.success){
          pagination.value = res.data.pagination
          products.value = res.data.products
          isLoading.value = false
        }else{
          showErrorAlert(res.data.message, './login.html')
        }
      }).catch(e => {
        showErrorAlert(e.response.data.message, './login.html')
      })
    }

    const editProduct = (data) => {
      formInvalidate.value = []
      tempProduct.value = { ...data }
      if (!Array.isArray(tempProduct.value.imagesUrl)){
        tempProduct.value.imagesUrl = []
      }
      productModal.value.show()
    }

    const updateProduct = (product) => {
      formInvalidate.value = []
      requiredData.forEach(item => {
          if (!product[item]) formInvalidate.value.push(item)
      })
      if (formInvalidate.value.length) {
          return
      }
      isLoading.value = true
      if (product.imagesUrl?.length) {
        product.imagesUrl = product.imagesUrl.filter(url => url !== '')
      }
      const HTTPMETHOD = product.id ? 'put' : 'post'
      const PATH = `${PRODUCT_PATH}${product.id ? `/${product.id}` : ''}`
      axios[HTTPMETHOD](`${BASE_URL}${PATH}`, { data: product })
        .then(res => {
          hideProductModal()
          showSuccessAlert(res.data.message)
          getData()
        }).catch(e => {
          showErrorAlert(e.response.data.message)
        })
    }

    const deleteConfirm = (product) => {
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
          deleteProduct(product.id)
        }
      });
    }
    const deleteProduct = (id) => {
      isLoading.value = true
      axios.delete(`${BASE_URL}${PRODUCT_PATH}/${id}`)
      .then(res => {
        showSuccessAlert(res.data.message)
        getData()
      }).catch(e => {
        showErrorAlert(e.response.data.message)
      })
    }

    const showSuccessAlert = (title) => {
      Swal.fire({
        title,
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      });
    }

    const showErrorAlert = (title, replace) => {
      isLoading.value = false
      Swal.fire({
        icon: "error",
        title,
        confirmButtonText: "確認",
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        if(replace){
          location.replace(replace)
        }
      });
    }

    const validate = (data) => {
      return formInvalidate.value.indexOf(data) > -1 ? true : false
    }

    const removeError = (data) => {
      const index = formInvalidate.value.indexOf(data)
      if(index > -1){
          formInvalidate.value.splice(index, 1)
      }
    }

    const hideProductModal = () => {
      productModal.value.hide()
    }

    const setPage = (page) => {
      nowPage.value = page
      getData()
    }

    onMounted(() => {
      checkAuth()
      productModal.value = new bootstrap.Modal(modal.value, {
        backdrop: 'static'
      })
      new bootstrap.Popover(popover.value, {
        container: '.modal-body'
      })
    })

    return{
      products,
      tempProduct,
      editProduct,
      updateProduct,
      deleteConfirm,

      validate,
      removeError,
      modal,
      hideProductModal,
      popover,

      isLoading,
      nowPage,
      pagination,
      setPage
    }
  }
})
app.use(VueLoading.LoadingPlugin);
app.component('loadingView', VueLoading.Component)
app.mount('#app')
