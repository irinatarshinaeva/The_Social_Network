const User = require('../models/user.model');
const Post = require('../models/post.model');
// Добавить мидлвар проверки авторизации ?
const { checkAuth } = require('../middleware/auth');
const axios = require('axios');
const cheerio = require('cheerio');

const account =
  (checkAuth,
  async (req, res) => {
    const user = req.session.user; // Узнаем юзера
    if (user) {
      const userPosts = await Post.find({ authorId: user.id });
      const toMeWrongs = await Post.find({ offenderId: user.id });

      res.json({ userPosts, toMeWrongs });
    }
  });

const oneWrong = async (req, res) => {
  const wrong = await Post.findOne({ _id: req.params.id }); // Находим конкретный пост
  res.json(wrong);
};

const advice = async (req, res) => {
  let parsingResultArray = [];
  await axios.get('https://www.psychologies.ru/articles/').then((res) => {
    const data = res.data.trim();
    const $ = cheerio.load(data, { xmlMode: true });
    let titleArray = [];
    let textArray = [];
    let linksArray = [];
    let photosArray = [];
    let title = $('a.rubric-anons_title').each((i, elem) => {
      titleArray.push($(elem).text());
    });
    let text = $('div.rubric-anons_text').each((i, elem) => {
      textArray.push($(elem).text());
    });
    let links = $('a.rubric-anons_title').each((i, elem) => {
      linksArray.push('https://www.psychologies.ru' + $(elem).attr().href);
    });
    let photos = $('img.images').each((i, elem) => {
      photosArray.push($(elem).attr().src);
    });
    parsingResultArray = titleArray.map((el, i) => ({
      title: el,
      text: textArray[i],
      link: linksArray[i],
      img: photosArray[i],
    }));
  });
  res.json(parsingResultArray);
};

const makewrong =
  (checkAuth,
  async (req, res) => {
    const { category, reason, solve, rating, state } = req.body;
    const user = await User.findOne({ login: req.session.user.login });
    const offender = await User.findOne({ login: req.body.offender }); // В форме вводим логин обидчика, здесь делаем поиск по его логину в базе и кладем в пост его монго ID
    if (category && reason && solve && rating && state && user && offender) {
      const newPost = await new Post({
        category,
        reason,
        solve,
        status: 'Открыта',
        rating,
        state,
        offenderId: offender._id,
        offenderName: req.body.offender,
        authorId: user._id,
        authorName: req.session.user.login,
        date: new Date().toLocaleDateString(),
        authorName: req.session.user.login,
      });
      await newPost.save();
      return res.json({ newPost, offenderSocketID: offender.socketID });
    } else {
      return res.sendStatus(406);
    }
  });

const allMessages = async (req, res) => {
  const wrong = await Post.findById(req.params.id);
  res.json(wrong.sms);
};

const changeAnswer = async (req, res) => {
  const wrong = await Post.findById(req.body.id);
  if (wrong) {
    if (wrong.offenderName === req.body.user) {
      wrong.offenderAnswer = req.body.answer;
    } else {
      wrong.authorAnswer = req.body.answer;
    }
    await wrong.save();
    if (!wrong.authorAnswer || !wrong.offenderAnswer) {
      wrong.state = 'Публичная';
      await wrong.save();
    }
    if (wrong.authorAnswer === true && wrong.offenderAnswer === true) {
      return wrong.remove();
    }
  }
};
module.exports = {
  account,
  advice,
  makewrong,
  allMessages,
  oneWrong,
  changeAnswer,
};
