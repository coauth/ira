<script lang="ts">
    import { onMount } from "svelte";
    import { Toast, Button } from "flowbite-svelte";
    import { fly } from "svelte/transition";
    import appConfig from "src/config/config";
    import AlertContent from "./AlertContent.svelte";
    import type { TAlertProps } from "../types/AlertPropsTypes";
    import type { TPolicyMessage } from "../helpers/PolicyHelper";

    export let props: TPolicyMessage;

    let toastStatus = false;

    let timeoutVariable;

    const changeStatus = () => {
        toastStatus = true;
    };

    function rigthClickListener(event) {
        changeStatus();
        timeoutVariable = setTimeout(() => {
            toastStatus = false;
        }, appConfig.toastTimeoutInSeconds * 1000);
        event.preventDefault();
    }

    function applyToIframes() {
        document.querySelectorAll("iframe").forEach((iframe) => {
            if (window.frames["" + iframe.id]) {
                window.frames["" + iframe.id].addEventListener(
                    "contextmenu",
                    (e) => {
                        rigthClickListener(e);
                    }
                );
            }
        });
    }
    const intervalID = setInterval(applyToIframes, 2000);
    document.addEventListener("contextmenu", rigthClickListener);
    let position:string;
    if(props.location==='top'){
        position='top';
    }else{
        position='bottom';
    }

</script>

<div
    id="toast-top-left"
    class="fixed z-[1000] flex items-start w-full max-w-xl p-0 shadow-md {position}-5 right-5"
    style={toastStatus
        ? "display: block !important"
        : "display: none !important"}
    role="alert"
>
    <AlertContent {props} />
</div>
