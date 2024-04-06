import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export function responsiveScreen() {

    const screenWidth = ref(window.innerWidth);

    function checkScreenSize(){
        screenWidth.value = window.innerWidth;
    };
    
    onMounted(() => {
        window.addEventListener('resize', checkScreenSize)
    });
    
    onUnmounted(() => {
        window.removeEventListener('resize', checkScreenSize)
    });
    return { screenWidth };
}