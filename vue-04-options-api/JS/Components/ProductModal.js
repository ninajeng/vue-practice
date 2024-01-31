export default {
    data() {
        return {
            productModal: {},
            requiredData: [
                'title',
                'category',
                'unit',
                'origin_price',
                'price'
            ],
            formInvalidate: []
        }
    },
    props: ['productData'],
    template: '#productModalView',
    methods: {
        show(){
            this.productModal.show()
        },
        hide(){
            this.productModal.hide()
        },
        validate(data){
            return this.formInvalidate.indexOf(data) > -1 ? true : false
        },
        removeError(data){
            const index = this.formInvalidate.indexOf(data)
            if(index > -1){
                this.formInvalidate.splice(index, 1)
            }
        },
        updateProduct(){
            this.formInvalidate = []
            this.requiredData.forEach(item => {
                if (!this.productData[item]) this.formInvalidate.push(item)
            })
            if (!this.formInvalidate.length) {
                this.$emit('updateProduct', this.productData)
            }
        }
    },
    mounted(){
        this.productModal = new bootstrap.Modal(this.$refs.modal, {
            backdrop: 'static'
          })
        new bootstrap.Popover(this.$refs.popover, {
            container: '.modal-body'
          })
    }
}