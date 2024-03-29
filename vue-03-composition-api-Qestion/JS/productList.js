const { createApp, ref, onMounted } = Vue

const app = createApp({
  setup(){
    const products = ref({})
    const tempProduct = ref({
      imagesUrl: []
    })
    let formInvalidate = []
    const requiredData = [
      'title',
      'category',
      'unit',
      'origin_price',
      'price'
    ]
    const modal = ref(null)  //$refs
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
          alert(res.data.message)
          isLoading.value = false
          location.replace('./login.html')
        }else{
          getData()
        }
      }).catch(e => {
        alert(e.response.data.message)
        isLoading.value = false
        location.replace('./login.html')
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
          alert(res.data.message)
        }
      }).catch(e => alert(e.response.data.message))
    }

    const editProduct = (data) => {
      formInvalidate = []
      tempProduct.value = { ...data }
      if (!Array.isArray(tempProduct.value.imagesUrl)){
        tempProduct.value.imagesUrl = []
      }
      productModal.value.show()
    }

    const updateProduct = (product) => {
      formInvalidate = []
      requiredData.forEach(item => {
          if (!product[item]) formInvalidate.push(item)
      })
      if (formInvalidate.length) {
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
          isLoading = false
          alert(e.response.data.message)
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
        isLoading.value = false
        alert(e.response.data.message)
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

    const validate = (data) => {
      return formInvalidate.indexOf(data) > -1 ? true : false
    }

    const removeError = (data) => {
      const index = formInvalidate.indexOf(data)
      if(index > -1){
          formInvalidate.splice(index, 1)
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
