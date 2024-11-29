/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface DaaiButton {
        "customClass": string;
        "onClick": (event: MouseEvent) => void;
    }
    interface DaaiButtonWithIcon {
        "disabled": boolean;
        "type": 'primary' | 'secondary';
    }
    interface DaaiConfigMicIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiConsultationRecorder {
    }
    interface DaaiFinishRecordingIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiLogoIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiMicIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiPauseIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiStethoscopeIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiSupportIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiText {
        "text": string;
    }
}
declare global {
    interface HTMLDaaiButtonElement extends Components.DaaiButton, HTMLStencilElement {
    }
    var HTMLDaaiButtonElement: {
        prototype: HTMLDaaiButtonElement;
        new (): HTMLDaaiButtonElement;
    };
    interface HTMLDaaiButtonWithIconElement extends Components.DaaiButtonWithIcon, HTMLStencilElement {
    }
    var HTMLDaaiButtonWithIconElement: {
        prototype: HTMLDaaiButtonWithIconElement;
        new (): HTMLDaaiButtonWithIconElement;
    };
    interface HTMLDaaiConfigMicIconElement extends Components.DaaiConfigMicIcon, HTMLStencilElement {
    }
    var HTMLDaaiConfigMicIconElement: {
        prototype: HTMLDaaiConfigMicIconElement;
        new (): HTMLDaaiConfigMicIconElement;
    };
    interface HTMLDaaiConsultationRecorderElement extends Components.DaaiConsultationRecorder, HTMLStencilElement {
    }
    var HTMLDaaiConsultationRecorderElement: {
        prototype: HTMLDaaiConsultationRecorderElement;
        new (): HTMLDaaiConsultationRecorderElement;
    };
    interface HTMLDaaiFinishRecordingIconElement extends Components.DaaiFinishRecordingIcon, HTMLStencilElement {
    }
    var HTMLDaaiFinishRecordingIconElement: {
        prototype: HTMLDaaiFinishRecordingIconElement;
        new (): HTMLDaaiFinishRecordingIconElement;
    };
    interface HTMLDaaiLogoIconElement extends Components.DaaiLogoIcon, HTMLStencilElement {
    }
    var HTMLDaaiLogoIconElement: {
        prototype: HTMLDaaiLogoIconElement;
        new (): HTMLDaaiLogoIconElement;
    };
    interface HTMLDaaiMicIconElement extends Components.DaaiMicIcon, HTMLStencilElement {
    }
    var HTMLDaaiMicIconElement: {
        prototype: HTMLDaaiMicIconElement;
        new (): HTMLDaaiMicIconElement;
    };
    interface HTMLDaaiPauseIconElement extends Components.DaaiPauseIcon, HTMLStencilElement {
    }
    var HTMLDaaiPauseIconElement: {
        prototype: HTMLDaaiPauseIconElement;
        new (): HTMLDaaiPauseIconElement;
    };
    interface HTMLDaaiStethoscopeIconElement extends Components.DaaiStethoscopeIcon, HTMLStencilElement {
    }
    var HTMLDaaiStethoscopeIconElement: {
        prototype: HTMLDaaiStethoscopeIconElement;
        new (): HTMLDaaiStethoscopeIconElement;
    };
    interface HTMLDaaiSupportIconElement extends Components.DaaiSupportIcon, HTMLStencilElement {
    }
    var HTMLDaaiSupportIconElement: {
        prototype: HTMLDaaiSupportIconElement;
        new (): HTMLDaaiSupportIconElement;
    };
    interface HTMLDaaiTextElement extends Components.DaaiText, HTMLStencilElement {
    }
    var HTMLDaaiTextElement: {
        prototype: HTMLDaaiTextElement;
        new (): HTMLDaaiTextElement;
    };
    interface HTMLElementTagNameMap {
        "daai-button": HTMLDaaiButtonElement;
        "daai-button-with-icon": HTMLDaaiButtonWithIconElement;
        "daai-config-mic-icon": HTMLDaaiConfigMicIconElement;
        "daai-consultation-recorder": HTMLDaaiConsultationRecorderElement;
        "daai-finish-recording-icon": HTMLDaaiFinishRecordingIconElement;
        "daai-logo-icon": HTMLDaaiLogoIconElement;
        "daai-mic-icon": HTMLDaaiMicIconElement;
        "daai-pause-icon": HTMLDaaiPauseIconElement;
        "daai-stethoscope-icon": HTMLDaaiStethoscopeIconElement;
        "daai-support-icon": HTMLDaaiSupportIconElement;
        "daai-text": HTMLDaaiTextElement;
    }
}
declare namespace LocalJSX {
    interface DaaiButton {
        "customClass"?: string;
        "onClick"?: (event: MouseEvent) => void;
    }
    interface DaaiButtonWithIcon {
        "disabled"?: boolean;
        "type"?: 'primary' | 'secondary';
    }
    interface DaaiConfigMicIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiConsultationRecorder {
    }
    interface DaaiFinishRecordingIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiLogoIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiMicIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiPauseIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiStethoscopeIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiSupportIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiText {
        "text"?: string;
    }
    interface IntrinsicElements {
        "daai-button": DaaiButton;
        "daai-button-with-icon": DaaiButtonWithIcon;
        "daai-config-mic-icon": DaaiConfigMicIcon;
        "daai-consultation-recorder": DaaiConsultationRecorder;
        "daai-finish-recording-icon": DaaiFinishRecordingIcon;
        "daai-logo-icon": DaaiLogoIcon;
        "daai-mic-icon": DaaiMicIcon;
        "daai-pause-icon": DaaiPauseIcon;
        "daai-stethoscope-icon": DaaiStethoscopeIcon;
        "daai-support-icon": DaaiSupportIcon;
        "daai-text": DaaiText;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "daai-button": LocalJSX.DaaiButton & JSXBase.HTMLAttributes<HTMLDaaiButtonElement>;
            "daai-button-with-icon": LocalJSX.DaaiButtonWithIcon & JSXBase.HTMLAttributes<HTMLDaaiButtonWithIconElement>;
            "daai-config-mic-icon": LocalJSX.DaaiConfigMicIcon & JSXBase.HTMLAttributes<HTMLDaaiConfigMicIconElement>;
            "daai-consultation-recorder": LocalJSX.DaaiConsultationRecorder & JSXBase.HTMLAttributes<HTMLDaaiConsultationRecorderElement>;
            "daai-finish-recording-icon": LocalJSX.DaaiFinishRecordingIcon & JSXBase.HTMLAttributes<HTMLDaaiFinishRecordingIconElement>;
            "daai-logo-icon": LocalJSX.DaaiLogoIcon & JSXBase.HTMLAttributes<HTMLDaaiLogoIconElement>;
            "daai-mic-icon": LocalJSX.DaaiMicIcon & JSXBase.HTMLAttributes<HTMLDaaiMicIconElement>;
            "daai-pause-icon": LocalJSX.DaaiPauseIcon & JSXBase.HTMLAttributes<HTMLDaaiPauseIconElement>;
            "daai-stethoscope-icon": LocalJSX.DaaiStethoscopeIcon & JSXBase.HTMLAttributes<HTMLDaaiStethoscopeIconElement>;
            "daai-support-icon": LocalJSX.DaaiSupportIcon & JSXBase.HTMLAttributes<HTMLDaaiSupportIconElement>;
            "daai-text": LocalJSX.DaaiText & JSXBase.HTMLAttributes<HTMLDaaiTextElement>;
        }
    }
}
