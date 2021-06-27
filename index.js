#!/usr/bin/env node

const search = require('youtube-search')
const { Select } = require('enquirer')
const ENV_NAME_API_KEY = 'BGM_RECOMMEND_API_KEY'

const chooseKeyword = async () => {
  const keywordList = () => {
    const genreList = ['jazz', 'relax', 'study', 'piano', 'Bossa Nova', 'hawaiian', 'celtic']
      .sort(() => (Math.random() - 0.5))
      .slice(0, 3)
    const suffixList = ['music', 'radio', '24/7', 'Live', '作業用BGM']
      .sort(() => (Math.random() - 0.5))
      .slice(0, 3)
    return genreList.map((genre, i) => {
      return [genre, suffixList[i]].join(' ')
    })
  }
  const prompt = new Select({
    name: 'choose keyword',
    message: 'Pick the one you like',
    choices: keywordList()
  })
  return prompt.run()
}

const searchBgm = async keyword => {
  const opts = {
    type: ['video'],
    maxResults: 3,
    key: process.env[ENV_NAME_API_KEY]
  }
  return new Promise((resolve, reject) => {
    search(keyword, opts, function (err, results) {
      if (err) {
        reject(err)
        return
      }
      const candidates = results.map(result => [result.title, result.link])
      resolve(candidates)
    })
  })
}

const display = recommends => {
  console.log('These look good.')
  recommends.forEach(element => {
    console.log('🎶' + element[0])
    console.log('🔗' + element[1])
  })
}

const main = async () => {
  if (!process.env[ENV_NAME_API_KEY]) {
    console.log(`Environment variable ${ENV_NAME_API_KEY} is missing`)
    process.exit(1)
  }

  try {
    const keyword = await chooseKeyword()
    const recommends = await searchBgm(keyword)
    display(recommends)
  } catch (err) {
    console.error(err.message)
    process.exitCode = 1
  }
}

main()
