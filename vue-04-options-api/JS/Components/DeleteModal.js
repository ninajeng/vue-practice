export default {
    data() {
        return {
        }
    },
    template: '<div></div>',
    methods: {
        show(product){
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
                  this.$emit('deleteProduct', product.id)
                }
              });
        }
    }
}