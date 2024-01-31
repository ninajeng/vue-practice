// Install all rules
Object.keys(VeeValidateRules).forEach(rule => {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true
});

const app = Vue.createApp({
    data(){
        return{
            username: '',
            password: '',
            BASE_URL: 'https://ec-course-api.hexschool.io/',
            SIGNIN_PATH: 'v2/admin/signin',
            errorRes: ''
        }
    },
    methods: {
        signin(){
            axios.post(`${this.BASE_URL}${this.SIGNIN_PATH}`, {username: this.username, password: this.password})
            .then(res => {
                if(res.data.success){
                    const { token, expired } = res.data
                    document.cookie = `VegetableShopToken=${token}; expires=${new Date(expired)}; Secure`
                    location.assign('./productList.html')
                }else{
                    this.errorRes = res.data.message
                }
            }).catch(e => {
                this.errorRes = e.response.data.message
                this.password = ''
            })
        }
    }
  });
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');