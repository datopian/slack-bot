const fs = require('fs')
const path = require('path')
const moment = require('moment')


const config = require('../config.json')
const messages = require('./messages.js').messages
const formatting = require('./formatting.js').formatting
const gdocs = require('./gdocs.js').gdocs


module.exports = robot => {
  robot.hear(/.*/i, res => {
    let ref
    const message = formatting.getDataMask(res.message.text, /\+[^*\s]+/)
    for (let key in config.monitor) {
      if (message !== null) {
        if (key === message) {
          for (let i = 0; i < config.monitor[message].dest.length; i++) {
            ref = config.monitor[message].dest[i]
            if (message === '+outcome') {
              messages[config.docs[ref].fun](res.message, config.docs[ref].dest, info => {
                console.log('Added at: ' + info['app:edited'])
                res.reply('Outcome recorded: your score was ' + info.total + '/10')
              })
            } else {
              messages[config.docs[ref].fun](res.message, config.docs[ref].dest, info => {
                console.log('Added at: ' + info['app:edited'])
                res.reply(message + ' recorded')
              })
            }
          }
        }
      }
    }
  })

  robot.hear(/bot todos|bot standups|bot links|bot promises|bot integrities|bot outcomes|bot feedback/i, res => {
    const tags = [
      {tag: '+todo', command: 'todos'},
      {tag: '+standup', command: 'standups'},
      {tag: '+link', command: 'links'},
      {tag: '+promise', command: 'promises'},
      {tag: '+integrity', command: 'integrities'},
      {tag: '+outcome', command: 'outcomes'},
      {tag: '+feedback', command: 'feedback'}
    ]
    const message = res.message.text.split(' ')
    tags.forEach(tag => {
      if (tag.command === message[1]) {
        let key
        let ref
        for (key in config.monitor) {
          if (key === tag.tag) {
            for (let i = 0; i < config.monitor[tag.tag].dest.length; i++) {
              ref = config.monitor[tag.tag].dest[i]
              const gdoc = config.docs[ref].dest
              gdocs.setAuth(gdoc, (err, info) => {
                if (!err) {
                  info[1].worksheets.forEach(worksheet => {
                    if ('bot ' + worksheet.title === res.message.text) {
                      const glink = worksheet._links['http://schemas.google.com/visualization/2008#visualizationApi']
                      let gid = glink.split('?')
                      gid = gid[1]
                      switch (worksheet.title | res.message.text) {
                        case 'todos' | 'bot todos' :
                          res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                          break
                        case 'standups' | 'bot standups' :
                          break
                        case 'links' | 'bot links' :
                          res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                          break
                        case 'integrities' | 'bot integrities' :
                          res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                          break
                        case 'promises' | 'bot promises':
                          res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                          break
                        case 'outcomes' | 'bot outcomes':
                          res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                          break
                        case 'feedback' | 'bot feedback':
                          res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                          break
                        default:
                          break
                      }
                    }
                  })
                } else {
                  console.log(err)
                }
              })
            }
          }
        }
      }
    })
  })

  robot.error((err, res) => {
    console.log(err)
    robot.logger.error('DOES NOT COMPUTE')

    if (res !== null) {
      res.reply('DOES NOT COMPUTE')
    }
  })
}
