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

const { createApp, ref } = Vue

const app = createApp({
    setup(){
        const user = ref({
            username: '',
            password: ''
        })
        const BASE_URL = 'https://ec-course-api.hexschool.io/'
        const SIGNIN_PATH = 'v2/admin/signin'
        const errorRes = ref('')

        const signin = () => {
            axios.post(`${BASE_URL}${SIGNIN_PATH}`, user.value)
            .then(res => {
                if(res.data.success){
                    const { token, expired } = res.data
                    document.cookie = `VegetableShopToken=${token}; expires=${new Date(expired)}; Secure`
                    location.assign('./productList.html')
                }else{
                    errorRes.value = res.data.message
                }
            }).catch(e => {
                errorRes.value = e.response.data.message
                user.value.password = ''
            })
        }
        return{
            user, errorRes, signin
        }
    }
})

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');