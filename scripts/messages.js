const formatting = require('./formatting.js').formatting
const gdocs = require('./gdocs.js').gdocs


const sendMessage = (message, dest, callback) => {
  formatMessage(message, res => {
    gdocs.setAuth(dest, (err, info) => {
      if (!err) {
        info[1].worksheets.forEach(worksheet => {
          if (res.action === 'todo' && worksheet.title === 'todos') {
            gdocs.addRow(worksheet.id, res, (err, info) => {
              if (err) {
                console.log(err)
              }
              callback(info)
            })
          } else if (res.action === 'link' && worksheet.title === 'links') {
            gdocs.addRow(worksheet.id, res, (err, info) => {
              if (err) {
                console.log(err)
              }
              callback(info)
            })
          } else if (res.action === 'standup' && worksheet.title === 'standups') {
            gdocs.addRow(worksheet.id, res, (err, info) => {
              if (err) {
                console.log(err)
              }
              callback(info)
            })
          } else if (res.action === 'promise' && worksheet.title === 'promises') {
            gdocs.addRow(worksheet.id, res, (err, info) => {
              if (err) {
                console.log(err)
              }
              callback(info)
            })
          } else if (res.action === 'integrity' && worksheet.title === 'integrities') {
            gdocs.addRow(worksheet.id, res, (err, info) => {
              if (err) {
                console.log(err)
              }
              callback(info)
            })
          } else if (res.action === 'outcome' && worksheet.title === 'outcomes') {
            gdocs.addRow(worksheet.id, res, (err, info) => {
              if (err) {
                console.log(err)
              }
              callback(info)
            })
          } else if (res.action === 'feedback' && worksheet.title === 'feedback') {
            gdocs.addRow(worksheet.id, res, (err, info) => {
              if (err) {
                console.log(err)
              }
              callback(info)
            })
          }
        })
      } else {
        console.log(err)
      }
    })
  })
}

const formatMessage = (message, callback) => {
  const action = formatting.getDataMask(message.text, /\+[^*\s]+/)
  let assignees = formatting.getDataMask(message.text, /@[^*\s]+/)
  const name = formatting.getName(message.user.name)
  const poster = '@' + message.user.login + ' (' + name + ')'
  if (assignees === '') {
    assignees = poster
  }
  const msg = formatting.removeFromMessage(message.text, action)
  const prepPoint = parseFloat((parseFloat(msg.split(',')[0], 2) / 100.0) * 3, 10)
  const donePoint = parseFloat((parseFloat(msg.split(',')[1], 2) / 100.0) * 4, 10)
  const satisfactionPoint = parseFloat((parseFloat(msg.split(',')[2], 2) / 100.0) * 3, 10)
  const total = satisfactionPoint + prepPoint + donePoint
  callback({
    action: action.substr(1),
    timestamp: new Date().toISOString(),
    poster,
    assignees,
    message: formatting.removeFromMessage(msg, assignees),
    room: 'N/A',
    standup: formatting.removeFromMessage(msg, assignees),
    integrity: formatting.removeFromMessage(msg, assignees),
    promise: formatting.removeFromMessage(msg, assignees),
    blockers: '\n' + formatting.getStandup(message.text, action, /(blockers:|Blockers:)((.|\n)*)(last24|last 24|Last24|Last 24)/),
    last24: formatting.getStandup(message.text, action, /(last24:|last 24:|Last24:|Last 24:)((.|\n)*)(next24|next 24|Next24|Next 24)/),
    next24: formatting.getStandup(message.text, action, /(next24:|next 24:|Next24:|Next 24:)((.|\n)*)/) + '\n',
    prep: msg.split(',')[0],
    done: msg.split(',')[1],
    satisfaction: msg.split(',')[2],
    total
  })
}

exports.messages = {
  sendMessage,
  formatMessage
}
