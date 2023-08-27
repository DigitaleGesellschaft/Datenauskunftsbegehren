export default {
  title: 'Generiere dein Datenauskunftsbegehren',
  intro: 'Gemäss Datenschutzgesetz hat jede Person das Recht zu erfahren, welche Daten über sie gespeichert sind, und diese – wenn nötig – löschen oder korrigieren zu lassen. Dieses Auskunftsrecht ermöglicht es, die Kontrolle über die eigenen Personendaten zu behalten. Jede Person muss aber selber aktiv werden und dieses Recht wahrnehmen.',
  steps: {
    one: {
      org: 'Direkt ein Unternehmen oder eine Behörde auswählen',
      type: 'Ein Unternehmen oder eine Behörde über den Geschäftsbereich auswählen',
      event: 'Ein Datenauskunftsbegehren aus einem speziellen Grund stellen',
      followup: 'Zu einem bereits gestellten Datenauskunftsbegehren nachfassen',
      id: 'Eine Kopie Deines amtlichen Ausweises bereitstellem',
      idcap_front: 'hier Kamera aktivieren um den Ausweis zu fotografieren',
      idcap_back: 'hier Kamera aktivieren um die Rückseite zu fotografieren',
      idimp_front: 'hier die Ausweis-Vorderseite vom Dateisystem laden',
      idimp_back: 'hier die Ausweis-Rückseite vom Dateisystem laden',
      idimp_both: 'hier die Ausweis-Vorder und -Rückseite in einem Bild vom Dateisystem laden'
    }
  }
}

/**
 * Text variants along workflow objectives to show up after printing / before writing calendar ICS data
 * @returns {undefined} or string with current workflow objective
 */
export function getCausa(desire, mode) {
  let causa = undefined;
  let prefix = undefined;
  switch (desire) {
    case 'data_info_request':
      causa = "Datenauskunftsbegehren";
      break;
    case 'unanswered':
      causa = "Mahnung zum Datenauskunftsbegehren";
      break;
    case 'incomplete_answer':
      causa = "Einforderung zum Datenauskunftsbegehren";
      break;
    case 'data_correction':
      causa = "Aufforderung zur Datenänderung";
      break;
    case 'data_deletion':
      causa = "Aufforderung zur Datenlöschung";
      break;
  }
  if (desire === 'data_info_request') {
    switch (mode) {
      case 'print' :
        prefix = 'das';
        break;
      case 'cal' :
        prefix = 'ein';
        break;
    }
  } else {
    switch (mode) {
      case 'print' :
        prefix = 'die';
        break;
      case 'cal' :
        prefix = 'eine';
        break;
    }
  }

  return prefix + " " + causa;
}