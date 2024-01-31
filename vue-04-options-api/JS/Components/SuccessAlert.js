export default {
    template: '<div></div>',
    methods: {
        show(title){
            Swal.fire({
                title,
                icon: "success",
                showConfirmButton: false,
                timer: 1500
              });
        }
    }
}