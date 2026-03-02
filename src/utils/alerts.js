import { showCustomAlert } from "../components/Modal/RNAlert"

const DEFAULT_ALERT_TITLE = 'AIRPORT VALET'


export function showDialogue(
    message,
    arrayButtons = [],
    title = DEFAULT_ALERT_TITLE,
    okButtonHandler = () => { },
    okayButtonTitle,
    isNotPreferred
) {
    var arrayButtonsToShow = arrayButtons.concat([{ "text": okayButtonTitle || 'OK', onPress: okButtonHandler, isNotPreferred: isNotPreferred || false }])
    
    showCustomAlert(
        title,
        message,
        arrayButtonsToShow)

}