import './App.css';
import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";


function Article(props) {

  let { version, articleId } = useParams();
  let article = props.article ?? articles[articleId]
  console.log(version, articleId, article)
  let link = props.link ?? `/${version}/${article.id}`
  let nav = useNavigate()

  return (
    <article onClick={() => {if (!props.fullscreen) { window.location = link;} return null}}>
      { props.fullscreen && <button onClick={() => nav(`/${version}/`) }>Back to Home</button>}
      <div className='profpic'></div>
      <span>Posted by {article.user}</span>
      <p>{article.body}</p>
      <h1>{article.headline}</h1>
    </article>
  );
  
}

function Login(props) {

  let nav = useNavigate()
  let [success, setSucc] = useState(true);
  let [pass, setPass] = useState("");

  let style = {
    label: {
      display: "block",
      fontSize: ".75rem",
      marginBottom: "4pt"
    },
    inputBlock: {
      width: "100%",
    },
    input: {
      width: "100%",
      padding: "10pt 4pt",
      borderRadius: "5pt",
      border: 'none',
    },
    main: {
      color: "white",
      padding: "20pt",
      border: "1px solid gray",
      borderRadius: "10pt"
    },
    button: {
      width: "100%",
      padding: "15pt",
      backgroundColor: "rgb(100, 200, 230)",
      border: "none",
      color: "white",
      cursor: "pointer",
      borderRadius: "5pt",
    }
  }
  
  let pwLookup = {
    "abc123": "v1",
    "catdog": "v2",
    "thanks": "v3",
    "goodie": "v4",
  }

  return (
    <main style={style.main}>
    <h1>{ success ? "Log In" : "Please check login info."}</h1>
    <div style={style.inputBlock}>
    <label style={style.label} htmlFor="user">Username</label>
    <input style={style.input} name="user" onChange={e => props.setUser(e.target.value)} type="text" placeholder="ex: user01929"/>
    </div>
    <div style={style.inputBlock}>
    <label style={style.label} htmlFor="pass">Password</label>
    <input style={style.input} name="pass" onChange={e => setPass(e.target.value)} type="password"/>
    </div>
    <button type="submit" style={style.button} onClick={_ => {
      let path = pwLookup[pass]

      if (!path) {
        setSucc(false);
        return 
      }
      
      nav(`/${path}`)

    }}>Login</button>
  </main>
  )
}

let article = {
  id: 0,
  user: "user1",
  // link: "http://www.google.com",
  postTime: new Date(),
  image: "",
  body: `This is a really neat little site I found. This is a brief description of it, 
      and I thought you might like to check it out. In fact, here is another link 
      to check out while you're at it:
  `,
  headline: "Headline",
}

let articles = [ article, Object.assign({}, article), Object.assign ({}, article)]
for (let ind in articles) {
  articles[ind].id = ind
}


let Feed = props => (
    <div>
      <link rel="stylesheet" href='style.css'></link>
      <main>
        <h1>Welcome, {props.user}</h1>
        { props.articles.map(article => <Article key={article.id} article={article}/>) }
      </main>
    </div>
)

function App() {
  let [user, setUser] = useState("")
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Login/>}/>
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='/:version/' element={<Feed articles={articles}/>}/>
        <Route exact path='/:version/:articleId' element={<Article fullscreen/>}/>
      </Routes>
    </BrowserRouter>
  );
}



export default App;
