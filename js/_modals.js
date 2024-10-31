let dialogHandler;

function _loadModals(modal, modalBackground) {
    dialogHandler = new DialogHandler(modal, modalBackground);
}

class DialogHandler {
    constructor(modal, modalBackground) {
        this.modalBackground = modalBackground;
        this.modal = modal;

        for (let i = 0; i < this.modal.length; i++) {
            this.modal[i].onclick = e => {
                stopClickPropagation(e);
            }
        }

        this.dialog = {};
        this.dialog[Dialog.NOTIFICATION] = new NotificationDialog(this.modalBackground, this.modal[Dialog.NOTIFICATION]);
        this.dialog[Dialog.LOAD_NETWORK] = new LoadNetworkDialog(this.modalBackground, this.modal[Dialog.LOAD_NETWORK]);
        this.dialog[Dialog.SAVE_NETWORK] = new SaveNetworkDialog(this.modalBackground, this.modal[Dialog.SAVE_NETWORK]);

        this.dialogId = undefined;
    }

    show(dialogId, params) {
        this.hide();
        this.dialogId = dialogId;
        this.dialog[dialogId].show(params);
    }

    hide() {
        if (this.dialogId != undefined) {
            this.dialog[this.dialogId].hide();
        }
    }

    windowClick(e) {
        if (this.dialogId != undefined) {
            this.dialog[this.dialogId].windowClick();
        }
    }
}

class Dialog {
    static NOTIFICATION = 0;
    static LOAD_NETWORK = 1;
    static SAVE_NETWORK = 2;

    constructor(modalBackground, modal) {
        this.modalBackground = modalBackground;
        this.modal = modal;
    }

    windowClick() {
        this.hide();
    }

    hide() {
        this.modalBackground.style.display = "none";
        this.modal.style.display = "none";
    }

    show() {
        this.modalBackground.style.display = "flex";
        this.modal.style.display = "block";
    }
}

class NotificationDialog extends Dialog {
    constructor(modalBackground, modal) {
        super(modalBackground, modal);
        this.notificationHeadingLabel = document.getElementById("notificationLabael");
        this.notificationMessageLabel = document.getElementById("notificationBody");
        this.btnNotificationProceed = document.getElementById("notificationBtn");

        this.windowClickListener = undefined;
    }

    windowClick() {
        if (this.windowClickListener) {
            this.windowClickListener(this);
        } else {
            super.windowClick();
        }
    }

    hide() {
        super.hide();
    }

    show(params) {
        super.show();
        this.notificationHeadingLabel.textContent = params.title;
        this.notificationMessageLabel.textContent = params.message;
        this.btnNotificationProceed.textContent = params.btnLabel;
        this.btnNotificationProceed.onclick = params.onclick;
        this.windowClickListener = params.windowClickListener ? params.windowClickListener : undefined;
    }
}

class LoadNetworkDialog extends Dialog {
    constructor(modalBackground, modal) {
        super(modalBackground, modal);
        this.textarea = document.getElementById("loadNetworkInput");
        this.btnCancel = document.getElementById("loadNetworkCancelBtn");
        this.btnLoad = document.getElementById("loadNetworkLoadBtn");
        this.windowClickListener = undefined;

        this.btnCancel.onclick = e => {
            dialogHandler.hide();
        };
    }

    hide() {
        super.hide();
    }

    show(params) {
        super.show();
        if (params.input.trim().length > 0) {
            this.textarea.value = params.input;
        }
        this.btnLoad.onclick = () => {
            params.onclick(this.textarea.value);
        };
        this.windowClickListener = params.windowClickListener ? params.windowClickListener : undefined;
    }
}

class SaveNetworkDialog extends Dialog {
    constructor(modalBackground, modal) {
        super(modalBackground, modal);
        this.textarea = document.getElementById("saveNetworkInput");
        this.btnCancel = document.getElementById("saveNetworkCancelBtn");
        this.btnCopy = document.getElementById("saveNetworkCopyBtn");
        this.windowClickListener = undefined;

        this.btnCancel.onclick = e => {
            dialogHandler.hide();
        };
    }

    hide() {
        super.hide();
    }

    show(params) {
        super.show();
        this.textarea.value = params.input;
        this.btnCopy.onclick = () => {
            params.onclick(() => {
                this.textarea.select();
                this.textarea.setSelectionRange(0, this.textarea.value.length);
            });
        };
        this.windowClickListener = params.windowClickListener ? params.windowClickListener : undefined;
    }
}