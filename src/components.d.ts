/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface DaaiButton {
        "disabled": boolean;
    }
    interface DaaiButtonWithIcon {
        "disabled": boolean;
    }
    interface DaaiCheckbox {
        "checked": boolean;
        "disabled": boolean;
        "label": string;
    }
    interface DaaiClock {
        "status": string;
    }
    interface DaaiConfig {
    }
    interface DaaiConfigMicIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiConsultationActions {
        "apikey": any;
        "error": any;
        "event": any;
        "hideTutorial": boolean;
        "metadata": Record<string, any>;
        "mode": string;
        "professional": string;
        "recordingConfig": {
    onWarningRecordingTime: () => void;
    maxRecordingTime: number;
    warningRecordingTime: number;
  };
        "recordingTime": number;
        "specialty": any;
        "start": any;
        "success": any;
        "telemedicine": boolean;
        "videoElement"?: HTMLVideoElement;
    }
    interface DaaiConsultationRecorder {
        "apikey": string;
        "hideTutorial": boolean;
        "maxRecordingTime": number;
        "metadata": string;
        "onError": (err: Error) => void;
        "onEvent": (response: Response) => void;
        "onStart": (response: Response) => void;
        "onSuccess": (response: Response) => void;
        "onWarningRecordingTime": () => void;
        "professional": string;
        "specialty": string;
        "telemedicine": boolean;
        "videoElement"?: HTMLVideoElement;
        "warningRecordingTime": number;
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
    interface DaaiMenuIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiMenuTutorialIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiMic {
    }
    interface DaaiMicAnimation {
    }
    interface DaaiMicIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiModal {
        "headerTitle": string;
        "items": any[];
    }
    interface DaaiPauseIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiPopup {
        "apikey": string;
        "metadata": Record<string, any>;
        "mode": string;
        "professional": string;
    }
    interface DaaiPopupIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiPresencialIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiRecordingAnimation {
        "animationPausedColor": string;
        "animationRecordingColor": string;
        "status": string;
    }
    interface DaaiResumeRecordingIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiSpecialty {
        "professional": string;
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
    interface DaaiTelemedicineIcon {
        "color": string;
        "height": string;
        "width": string;
    }
    interface DaaiText {
        "tag": keyof HTMLElementTagNameMap;
        "text": string;
    }
}
export interface DaaiButtonCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDaaiButtonElement;
}
export interface DaaiButtonWithIconCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDaaiButtonWithIconElement;
}
export interface DaaiCheckboxCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDaaiCheckboxElement;
}
export interface DaaiClockCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDaaiClockElement;
}
export interface DaaiMicCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDaaiMicElement;
}
declare global {
    interface HTMLDaaiButtonElementEventMap {
        "onClick": any;
    }
    interface HTMLDaaiButtonElement extends Components.DaaiButton, HTMLStencilElement {
        addEventListener<K extends keyof HTMLDaaiButtonElementEventMap>(type: K, listener: (this: HTMLDaaiButtonElement, ev: DaaiButtonCustomEvent<HTMLDaaiButtonElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLDaaiButtonElementEventMap>(type: K, listener: (this: HTMLDaaiButtonElement, ev: DaaiButtonCustomEvent<HTMLDaaiButtonElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLDaaiButtonElement: {
        prototype: HTMLDaaiButtonElement;
        new (): HTMLDaaiButtonElement;
    };
    interface HTMLDaaiButtonWithIconElementEventMap {
        "onClick": any;
    }
    interface HTMLDaaiButtonWithIconElement extends Components.DaaiButtonWithIcon, HTMLStencilElement {
        addEventListener<K extends keyof HTMLDaaiButtonWithIconElementEventMap>(type: K, listener: (this: HTMLDaaiButtonWithIconElement, ev: DaaiButtonWithIconCustomEvent<HTMLDaaiButtonWithIconElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLDaaiButtonWithIconElementEventMap>(type: K, listener: (this: HTMLDaaiButtonWithIconElement, ev: DaaiButtonWithIconCustomEvent<HTMLDaaiButtonWithIconElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLDaaiButtonWithIconElement: {
        prototype: HTMLDaaiButtonWithIconElement;
        new (): HTMLDaaiButtonWithIconElement;
    };
    interface HTMLDaaiCheckboxElementEventMap {
        "change": boolean;
    }
    interface HTMLDaaiCheckboxElement extends Components.DaaiCheckbox, HTMLStencilElement {
        addEventListener<K extends keyof HTMLDaaiCheckboxElementEventMap>(type: K, listener: (this: HTMLDaaiCheckboxElement, ev: DaaiCheckboxCustomEvent<HTMLDaaiCheckboxElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLDaaiCheckboxElementEventMap>(type: K, listener: (this: HTMLDaaiCheckboxElement, ev: DaaiCheckboxCustomEvent<HTMLDaaiCheckboxElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLDaaiCheckboxElement: {
        prototype: HTMLDaaiCheckboxElement;
        new (): HTMLDaaiCheckboxElement;
    };
    interface HTMLDaaiClockElementEventMap {
        "recordingTimeUpdated": number;
    }
    interface HTMLDaaiClockElement extends Components.DaaiClock, HTMLStencilElement {
        addEventListener<K extends keyof HTMLDaaiClockElementEventMap>(type: K, listener: (this: HTMLDaaiClockElement, ev: DaaiClockCustomEvent<HTMLDaaiClockElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLDaaiClockElementEventMap>(type: K, listener: (this: HTMLDaaiClockElement, ev: DaaiClockCustomEvent<HTMLDaaiClockElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLDaaiClockElement: {
        prototype: HTMLDaaiClockElement;
        new (): HTMLDaaiClockElement;
    };
    interface HTMLDaaiConfigElement extends Components.DaaiConfig, HTMLStencilElement {
    }
    var HTMLDaaiConfigElement: {
        prototype: HTMLDaaiConfigElement;
        new (): HTMLDaaiConfigElement;
    };
    interface HTMLDaaiConfigMicIconElement extends Components.DaaiConfigMicIcon, HTMLStencilElement {
    }
    var HTMLDaaiConfigMicIconElement: {
        prototype: HTMLDaaiConfigMicIconElement;
        new (): HTMLDaaiConfigMicIconElement;
    };
    interface HTMLDaaiConsultationActionsElement extends Components.DaaiConsultationActions, HTMLStencilElement {
    }
    var HTMLDaaiConsultationActionsElement: {
        prototype: HTMLDaaiConsultationActionsElement;
        new (): HTMLDaaiConsultationActionsElement;
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
    interface HTMLDaaiMenuIconElement extends Components.DaaiMenuIcon, HTMLStencilElement {
    }
    var HTMLDaaiMenuIconElement: {
        prototype: HTMLDaaiMenuIconElement;
        new (): HTMLDaaiMenuIconElement;
    };
    interface HTMLDaaiMenuTutorialIconElement extends Components.DaaiMenuTutorialIcon, HTMLStencilElement {
    }
    var HTMLDaaiMenuTutorialIconElement: {
        prototype: HTMLDaaiMenuTutorialIconElement;
        new (): HTMLDaaiMenuTutorialIconElement;
    };
    interface HTMLDaaiMicElementEventMap {
        "interfaceEvent": { microphoneSelect: boolean };
    }
    interface HTMLDaaiMicElement extends Components.DaaiMic, HTMLStencilElement {
        addEventListener<K extends keyof HTMLDaaiMicElementEventMap>(type: K, listener: (this: HTMLDaaiMicElement, ev: DaaiMicCustomEvent<HTMLDaaiMicElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLDaaiMicElementEventMap>(type: K, listener: (this: HTMLDaaiMicElement, ev: DaaiMicCustomEvent<HTMLDaaiMicElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLDaaiMicElement: {
        prototype: HTMLDaaiMicElement;
        new (): HTMLDaaiMicElement;
    };
    interface HTMLDaaiMicAnimationElement extends Components.DaaiMicAnimation, HTMLStencilElement {
    }
    var HTMLDaaiMicAnimationElement: {
        prototype: HTMLDaaiMicAnimationElement;
        new (): HTMLDaaiMicAnimationElement;
    };
    interface HTMLDaaiMicIconElement extends Components.DaaiMicIcon, HTMLStencilElement {
    }
    var HTMLDaaiMicIconElement: {
        prototype: HTMLDaaiMicIconElement;
        new (): HTMLDaaiMicIconElement;
    };
    interface HTMLDaaiModalElement extends Components.DaaiModal, HTMLStencilElement {
    }
    var HTMLDaaiModalElement: {
        prototype: HTMLDaaiModalElement;
        new (): HTMLDaaiModalElement;
    };
    interface HTMLDaaiPauseIconElement extends Components.DaaiPauseIcon, HTMLStencilElement {
    }
    var HTMLDaaiPauseIconElement: {
        prototype: HTMLDaaiPauseIconElement;
        new (): HTMLDaaiPauseIconElement;
    };
    interface HTMLDaaiPopupElement extends Components.DaaiPopup, HTMLStencilElement {
    }
    var HTMLDaaiPopupElement: {
        prototype: HTMLDaaiPopupElement;
        new (): HTMLDaaiPopupElement;
    };
    interface HTMLDaaiPopupIconElement extends Components.DaaiPopupIcon, HTMLStencilElement {
    }
    var HTMLDaaiPopupIconElement: {
        prototype: HTMLDaaiPopupIconElement;
        new (): HTMLDaaiPopupIconElement;
    };
    interface HTMLDaaiPresencialIconElement extends Components.DaaiPresencialIcon, HTMLStencilElement {
    }
    var HTMLDaaiPresencialIconElement: {
        prototype: HTMLDaaiPresencialIconElement;
        new (): HTMLDaaiPresencialIconElement;
    };
    interface HTMLDaaiRecordingAnimationElement extends Components.DaaiRecordingAnimation, HTMLStencilElement {
    }
    var HTMLDaaiRecordingAnimationElement: {
        prototype: HTMLDaaiRecordingAnimationElement;
        new (): HTMLDaaiRecordingAnimationElement;
    };
    interface HTMLDaaiResumeRecordingIconElement extends Components.DaaiResumeRecordingIcon, HTMLStencilElement {
    }
    var HTMLDaaiResumeRecordingIconElement: {
        prototype: HTMLDaaiResumeRecordingIconElement;
        new (): HTMLDaaiResumeRecordingIconElement;
    };
    interface HTMLDaaiSpecialtyElement extends Components.DaaiSpecialty, HTMLStencilElement {
    }
    var HTMLDaaiSpecialtyElement: {
        prototype: HTMLDaaiSpecialtyElement;
        new (): HTMLDaaiSpecialtyElement;
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
    interface HTMLDaaiTelemedicineIconElement extends Components.DaaiTelemedicineIcon, HTMLStencilElement {
    }
    var HTMLDaaiTelemedicineIconElement: {
        prototype: HTMLDaaiTelemedicineIconElement;
        new (): HTMLDaaiTelemedicineIconElement;
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
        "daai-checkbox": HTMLDaaiCheckboxElement;
        "daai-clock": HTMLDaaiClockElement;
        "daai-config": HTMLDaaiConfigElement;
        "daai-config-mic-icon": HTMLDaaiConfigMicIconElement;
        "daai-consultation-actions": HTMLDaaiConsultationActionsElement;
        "daai-consultation-recorder": HTMLDaaiConsultationRecorderElement;
        "daai-finish-recording-icon": HTMLDaaiFinishRecordingIconElement;
        "daai-logo-icon": HTMLDaaiLogoIconElement;
        "daai-menu-icon": HTMLDaaiMenuIconElement;
        "daai-menu-tutorial-icon": HTMLDaaiMenuTutorialIconElement;
        "daai-mic": HTMLDaaiMicElement;
        "daai-mic-animation": HTMLDaaiMicAnimationElement;
        "daai-mic-icon": HTMLDaaiMicIconElement;
        "daai-modal": HTMLDaaiModalElement;
        "daai-pause-icon": HTMLDaaiPauseIconElement;
        "daai-popup": HTMLDaaiPopupElement;
        "daai-popup-icon": HTMLDaaiPopupIconElement;
        "daai-presencial-icon": HTMLDaaiPresencialIconElement;
        "daai-recording-animation": HTMLDaaiRecordingAnimationElement;
        "daai-resume-recording-icon": HTMLDaaiResumeRecordingIconElement;
        "daai-specialty": HTMLDaaiSpecialtyElement;
        "daai-stethoscope-icon": HTMLDaaiStethoscopeIconElement;
        "daai-support-icon": HTMLDaaiSupportIconElement;
        "daai-telemedicine-icon": HTMLDaaiTelemedicineIconElement;
        "daai-text": HTMLDaaiTextElement;
    }
}
declare namespace LocalJSX {
    interface DaaiButton {
        "disabled"?: boolean;
        "onOnClick"?: (event: DaaiButtonCustomEvent<any>) => void;
    }
    interface DaaiButtonWithIcon {
        "disabled"?: boolean;
        "onOnClick"?: (event: DaaiButtonWithIconCustomEvent<any>) => void;
    }
    interface DaaiCheckbox {
        "checked"?: boolean;
        "disabled"?: boolean;
        "label"?: string;
        "onChange"?: (event: DaaiCheckboxCustomEvent<boolean>) => void;
    }
    interface DaaiClock {
        "onRecordingTimeUpdated"?: (event: DaaiClockCustomEvent<number>) => void;
        "status"?: string;
    }
    interface DaaiConfig {
    }
    interface DaaiConfigMicIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiConsultationActions {
        "apikey"?: any;
        "error"?: any;
        "event"?: any;
        "hideTutorial"?: boolean;
        "metadata"?: Record<string, any>;
        "mode"?: string;
        "professional"?: string;
        "recordingConfig"?: {
    onWarningRecordingTime: () => void;
    maxRecordingTime: number;
    warningRecordingTime: number;
  };
        "recordingTime"?: number;
        "specialty"?: any;
        "start"?: any;
        "success"?: any;
        "telemedicine"?: boolean;
        "videoElement"?: HTMLVideoElement;
    }
    interface DaaiConsultationRecorder {
        "apikey"?: string;
        "hideTutorial"?: boolean;
        "maxRecordingTime"?: number;
        "metadata"?: string;
        "onError"?: (err: Error) => void;
        "onEvent"?: (response: Response) => void;
        "onStart"?: (response: Response) => void;
        "onSuccess"?: (response: Response) => void;
        "onWarningRecordingTime"?: () => void;
        "professional"?: string;
        "specialty"?: string;
        "telemedicine"?: boolean;
        "videoElement"?: HTMLVideoElement;
        "warningRecordingTime"?: number;
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
    interface DaaiMenuIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiMenuTutorialIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiMic {
        "onInterfaceEvent"?: (event: DaaiMicCustomEvent<{ microphoneSelect: boolean }>) => void;
    }
    interface DaaiMicAnimation {
    }
    interface DaaiMicIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiModal {
        "headerTitle"?: string;
        "items"?: any[];
    }
    interface DaaiPauseIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiPopup {
        "apikey"?: string;
        "metadata"?: Record<string, any>;
        "mode"?: string;
        "professional"?: string;
    }
    interface DaaiPopupIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiPresencialIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiRecordingAnimation {
        "animationPausedColor"?: string;
        "animationRecordingColor"?: string;
        "status"?: string;
    }
    interface DaaiResumeRecordingIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiSpecialty {
        "professional"?: string;
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
    interface DaaiTelemedicineIcon {
        "color"?: string;
        "height"?: string;
        "width"?: string;
    }
    interface DaaiText {
        "tag"?: keyof HTMLElementTagNameMap;
        "text"?: string;
    }
    interface IntrinsicElements {
        "daai-button": DaaiButton;
        "daai-button-with-icon": DaaiButtonWithIcon;
        "daai-checkbox": DaaiCheckbox;
        "daai-clock": DaaiClock;
        "daai-config": DaaiConfig;
        "daai-config-mic-icon": DaaiConfigMicIcon;
        "daai-consultation-actions": DaaiConsultationActions;
        "daai-consultation-recorder": DaaiConsultationRecorder;
        "daai-finish-recording-icon": DaaiFinishRecordingIcon;
        "daai-logo-icon": DaaiLogoIcon;
        "daai-menu-icon": DaaiMenuIcon;
        "daai-menu-tutorial-icon": DaaiMenuTutorialIcon;
        "daai-mic": DaaiMic;
        "daai-mic-animation": DaaiMicAnimation;
        "daai-mic-icon": DaaiMicIcon;
        "daai-modal": DaaiModal;
        "daai-pause-icon": DaaiPauseIcon;
        "daai-popup": DaaiPopup;
        "daai-popup-icon": DaaiPopupIcon;
        "daai-presencial-icon": DaaiPresencialIcon;
        "daai-recording-animation": DaaiRecordingAnimation;
        "daai-resume-recording-icon": DaaiResumeRecordingIcon;
        "daai-specialty": DaaiSpecialty;
        "daai-stethoscope-icon": DaaiStethoscopeIcon;
        "daai-support-icon": DaaiSupportIcon;
        "daai-telemedicine-icon": DaaiTelemedicineIcon;
        "daai-text": DaaiText;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "daai-button": LocalJSX.DaaiButton & JSXBase.HTMLAttributes<HTMLDaaiButtonElement>;
            "daai-button-with-icon": LocalJSX.DaaiButtonWithIcon & JSXBase.HTMLAttributes<HTMLDaaiButtonWithIconElement>;
            "daai-checkbox": LocalJSX.DaaiCheckbox & JSXBase.HTMLAttributes<HTMLDaaiCheckboxElement>;
            "daai-clock": LocalJSX.DaaiClock & JSXBase.HTMLAttributes<HTMLDaaiClockElement>;
            "daai-config": LocalJSX.DaaiConfig & JSXBase.HTMLAttributes<HTMLDaaiConfigElement>;
            "daai-config-mic-icon": LocalJSX.DaaiConfigMicIcon & JSXBase.HTMLAttributes<HTMLDaaiConfigMicIconElement>;
            "daai-consultation-actions": LocalJSX.DaaiConsultationActions & JSXBase.HTMLAttributes<HTMLDaaiConsultationActionsElement>;
            "daai-consultation-recorder": LocalJSX.DaaiConsultationRecorder & JSXBase.HTMLAttributes<HTMLDaaiConsultationRecorderElement>;
            "daai-finish-recording-icon": LocalJSX.DaaiFinishRecordingIcon & JSXBase.HTMLAttributes<HTMLDaaiFinishRecordingIconElement>;
            "daai-logo-icon": LocalJSX.DaaiLogoIcon & JSXBase.HTMLAttributes<HTMLDaaiLogoIconElement>;
            "daai-menu-icon": LocalJSX.DaaiMenuIcon & JSXBase.HTMLAttributes<HTMLDaaiMenuIconElement>;
            "daai-menu-tutorial-icon": LocalJSX.DaaiMenuTutorialIcon & JSXBase.HTMLAttributes<HTMLDaaiMenuTutorialIconElement>;
            "daai-mic": LocalJSX.DaaiMic & JSXBase.HTMLAttributes<HTMLDaaiMicElement>;
            "daai-mic-animation": LocalJSX.DaaiMicAnimation & JSXBase.HTMLAttributes<HTMLDaaiMicAnimationElement>;
            "daai-mic-icon": LocalJSX.DaaiMicIcon & JSXBase.HTMLAttributes<HTMLDaaiMicIconElement>;
            "daai-modal": LocalJSX.DaaiModal & JSXBase.HTMLAttributes<HTMLDaaiModalElement>;
            "daai-pause-icon": LocalJSX.DaaiPauseIcon & JSXBase.HTMLAttributes<HTMLDaaiPauseIconElement>;
            "daai-popup": LocalJSX.DaaiPopup & JSXBase.HTMLAttributes<HTMLDaaiPopupElement>;
            "daai-popup-icon": LocalJSX.DaaiPopupIcon & JSXBase.HTMLAttributes<HTMLDaaiPopupIconElement>;
            "daai-presencial-icon": LocalJSX.DaaiPresencialIcon & JSXBase.HTMLAttributes<HTMLDaaiPresencialIconElement>;
            "daai-recording-animation": LocalJSX.DaaiRecordingAnimation & JSXBase.HTMLAttributes<HTMLDaaiRecordingAnimationElement>;
            "daai-resume-recording-icon": LocalJSX.DaaiResumeRecordingIcon & JSXBase.HTMLAttributes<HTMLDaaiResumeRecordingIconElement>;
            "daai-specialty": LocalJSX.DaaiSpecialty & JSXBase.HTMLAttributes<HTMLDaaiSpecialtyElement>;
            "daai-stethoscope-icon": LocalJSX.DaaiStethoscopeIcon & JSXBase.HTMLAttributes<HTMLDaaiStethoscopeIconElement>;
            "daai-support-icon": LocalJSX.DaaiSupportIcon & JSXBase.HTMLAttributes<HTMLDaaiSupportIconElement>;
            "daai-telemedicine-icon": LocalJSX.DaaiTelemedicineIcon & JSXBase.HTMLAttributes<HTMLDaaiTelemedicineIconElement>;
            "daai-text": LocalJSX.DaaiText & JSXBase.HTMLAttributes<HTMLDaaiTextElement>;
        }
    }
}
