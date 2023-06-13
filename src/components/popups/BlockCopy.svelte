<script lang="ts">
    import { onMount } from "svelte";
    import { Toast, Button } from "flowbite-svelte";
    import { fly } from "svelte/transition";
    import appConfig from "src/config/config";
    import jQuery from "jquery";
    import type { TAlertProps } from "../types/AlertPropsTypes";
    import AlertContent from "./AlertContent.svelte";
    import type { TPolicyMessage } from "../helpers/PolicyHelper";

    export let props: TPolicyMessage;

    let toastStatus = false;

    let timeoutVariable: any;

    const changeStatus = () => {
        toastStatus = true;
    };

    jQuery(document).on("copy", function (e) {
        changeStatus();
        console.log("copy called");
        navigator.clipboard.writeText(appConfig.copyBlockedClipboardContent);
        timeoutVariable = setTimeout(() => {
            toastStatus = false;
        }, appConfig.toastTimeoutInSeconds * 1000);
        e.preventDefault();
        return false;
    });

    let position: string;
    if (props.location === "top") {
        position = "top";
    } else {
        position = "bottom";
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
