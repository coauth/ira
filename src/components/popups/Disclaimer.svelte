<script lang="ts">
    import { Button, Modal } from "flowbite-svelte";
    import type { TAlertProps } from "../types/AlertPropsTypes";
    import type { TPolicyMessage } from "../helpers/PolicyHelper";
    import Showdown from "showdown";
    import browser from "webextension-polyfill";

    let defaultModal = true;

    export let props: TPolicyMessage;

    let alertColor: string;
    if (props.alertType == "danger") {
        alertColor = "red";
    } else if (props.alertType == "warning") {
        alertColor = "orange";
    } else if (props.alertType == "info") {
        alertColor = "blue";
    } else if (props.alertType == "success") {
        alertColor = "green";
    }

    const diclaimerAccepted = (durationInSeconds) => {
        let askMessage = {
            category: "STORE_DISCLAIMER_ACCEPTANCE",
            data: {
                duration: durationInSeconds,
            },
        };
        console.log("askMessage", askMessage);
        browser.runtime.sendMessage(askMessage);
    };

    const mdConvertor = new Showdown.Converter();

    let htmlContent = filterXSS(mdConvertor.makeHtml(props.description));
    setTimeout(() => {
        if (!document.getElementById("staticModal")) {
            return;
        }
        let anchors = document
            .getElementById("staticModal")
            .getElementsByTagName("a");
        if (!anchors) {
            return;
        }
        for (var i = 0; i < anchors.length; i++) {
            anchors[i].setAttribute("target", "_blank");
        }
    }, 2000);

    const closeModal = (durationInSeconds: number) => {
        document.getElementById("overlayCustom").style.display = "none";
        document.getElementById("staticModal").style.display = "none";
        console.log("calling storing");
 //       if (durationInSeconds > 0) {
            console.log("called storing");
            durationInSeconds=60;
            diclaimerAccepted(durationInSeconds);
   //     }
    };
</script>

<!-- Modal toggle -->

<div
    id="overlayCustom"
    style="position: fixed; display: block;  width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 1000;  cursor: pointer;"
/>
<!-- Main modal -->
<div
    id="staticModal"
    data-modal-backdrop="static"
    tabindex="-1"
    aria-hidden="true"
    class="fixed top-0 left-0 right-0 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    style="display:block !important;   z-index: 1001;"
>
    <div
        class="relative w-full max-w-2xl max-h-full"
        style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);"
    >
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div
                class="flex items-center justify-start p-4 border-b rounded-t dark:border-gray-600"
            >
                <div class="py-1 pr-2">
                    <!-- danger -->
                    {#if props.alertType == "danger"}
                        <svg
                            class="h-10 w-10"
                            fill="none"
                            stroke={alertColor}
                            stroke-width="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                        </svg>
                    {:else if props.alertType == "warning"}
                        <!-- warning -->
                        <svg
                            class="h-10 w-10"
                            fill="none"
                            stroke={alertColor}
                            stroke-width="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            />
                        </svg>
                    {:else if props.alertType == "info"}
                        <!-- info -->
                        <svg
                            class="h-10 w-10"
                            fill="none"
                            stroke={alertColor}
                            stroke-width="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                            />
                        </svg>
                    {:else if props.alertType == "success"}
                        <!-- success -->
                        <svg
                            class="h-10 w-10"
                            fill="none"
                            stroke={alertColor}
                            stroke-width="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    {/if}
                </div>

                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {@html props.title}
                </h3>
            </div>
            <!-- Modal body -->
            <div class="p-6 space-y-6">
                {@html htmlContent}
            </div>
            <!-- Modal footer -->
            <div
                class="flex items-center justify-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
            >
                <button
                    data-modal-hide="staticModal"
                    type="button"
                    class="text-white bg-gray-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    on:click={() => closeModal(props.durationInSeconds)}
                    >Acknowledge & Continue</button
                >
            </div>
        </div>
    </div>
</div>

<style>
</style>
