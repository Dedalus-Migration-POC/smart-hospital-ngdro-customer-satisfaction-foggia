export const QUEST_LIST = {
  name: 'Questionario 1',
  id: 1,
  sections: [
    {
      name: '_Sezione 1',
      id: 1,
      questions: [
        {
          name: 'Domanda 1',
          id: 1,
          answerType: 'RATE',
          answers: [
            {
              name: 'Pessimo',
              description: null,
              id: 1,
              value: '0',
            },
            {
              name: 'Mediocre',
              description: null,
              id: 2,
              value: '1',
            },
            {
              name: 'Neutro',
              description: null,
              id: 3,
              value: '2',
            },
            {
              name: 'Buono',
              description: null,
              id: 4,
              value: '3',
            },
            {
              name: 'Eccellente',
              description: null,
              id: 5,
              value: '4',
            },
          ],
        },
        {
          name: 'Domanda 2',
          id: 2,
          answerType: 'RATE',
          answers: [
            {
              name: 'Pessimo',
              description: null,
              id: 1,
              value: '0',
            },
            {
              name: 'Mediocre',
              description: null,
              id: 2,
              value: '1',
            },
            {
              name: 'Neutro',
              description: null,
              id: 3,
              value: '2',
            },
            {
              name: 'Buono',
              description: null,
              id: 4,
              value: '3',
            },
            {
              name: 'Eccellente',
              description: null,
              id: 5,
              value: '4',
            },
          ],
        },
      ],
    },
  ],
}

// {
//   title: 'Questionario di gradimento sul ricovero',
//   id: 'Questionario_di_gradimento_sul_ricovero',
//   sections: [
//     {
//       title: 'Arrivo in ospedale',
//       id: 'Arrivo_in_ospedale',
//       questionsList: [
//         {
//           title:
//             'Chiarezza della segnaletica per arrivare all’ospedalea segnaletica per arrivare all’ospedale',
//           id: '111',
//         },
//         {
//           title: 'Tempo di attesa per ricevere la prestazione',
//           id: '222',
//         },
//         {
//           title: 'Tempo di attesa per ricevere la prestazione 1',
//           id: '11222',
//         },
//         {
//           title: 'Tempo di attesa per ricevere la prestazione 2',
//           id: '22222',
//         },
//       ],
//     },
//     {
//       title: 'Assistenza medica',
//       id: 'Assistenza_medica',
//       questionsList: [
//         {
//           title: 'Domanda - 1',
//           id: '333',
//         },
//         {
//           title: 'Domanda - 2',
//           id: '444',
//         },
//         {
//           title: 'Domanda - 3',
//           id: '4444',
//         },
//         {
//           title: 'Domanda -4',
//           id: '444455',
//         },
//       ],
//     },
//     {
//       title: 'Accoglienza',
//       id: 'Accoglienza',
//       questionsList: [
//         {
//           title: 'Domanda - 1',
//           id: '555',
//         },
//         {
//           title: 'Domanda - 2',
//           id: '666',
//         },
//       ],
//     },
//   ],
// }

export const healthcareUnit = {
  id: 1,
  type: 'SSD',
  name: 'Allergologia e Immunologia Clinica Universitaria',
  departments: ['AMBULATORY'],
}
