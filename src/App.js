import './App.css';
import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { createUser } from "./services/users-service"; import { createInteraction } from "./services/logs-service";

function navWithClickLog(nav, path, data={}) {

  // log interaction
  let interaction = {
    username: window.localStorage.getItem('user'),
    link: path,
    data: JSON.stringify(data)
  }

  createInteraction(interaction)
    .then(_ => {
      if (path[0] === "/") nav(path)
      else window.location.href = path
    })
    .catch(e => console.log(e))

}

function Article(props) {

  let linkStyles = {
    // default
    "v0": {  },

    // display external links
    "v1": {
      "internal": { display: "none" },
      "external": { }
    },

    // tooltip
    "v2": {
      "internal": { },
      "external": { }
    },

    // stops interaction
    "v3": {
      
    }
  }

  let nav = useNavigate()
  let { version, articleId } = useParams();
  let article = props.article ?? articles[articleId]
  let link = article.link ?? `/${version}/${article.id}`

  let isRelative = link[0] === "/"
  let linkType = isRelative ? "internal" : "external";
  let linkStyle = linkStyles[version][linkType]

  let clickHandler = _ => {
    let didProceedOnV3 = version === "v3" && !isRelative && 
      window.confirm(`This is an external link. Click [ Ok ] to proceed or [ Cancel ] to go back.`)

    if (!props.fullscreen && (version !== "v3" || didProceedOnV3)) {
      navWithClickLog(nav, link);
    }

  }

  let [ isHovering, setHover] = useState(false);

  return (
    <article 
      onClick={clickHandler} 
      onMouseEnter={_ => setHover(true)} 
      onMouseLeave={_ => setHover(false)} 
    >
      { 
      version === "v2" && isHovering && !isRelative &&
      <div data-tooltip-text="This is an external site." className={"tooltip"}></div>
      }
      { 
      props.fullscreen && 
      <button onClick={() => navWithClickLog(nav, `/${version}/`) }>Back to Home</button>
      }
      <div className='profpic'></div>
      <span>Posted by {article.user}</span>
      <p>{article.body}</p>
      <h1>{article.headline}</h1>
      { 
      version === "v1" && 
      <span className={"link"} style={linkStyle}>{isRelative ? "" : link }</span> 
      }
    </article>

  );
  
}

function Login(props) {

  let nav = useNavigate();
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

      window.localStorage.setItem('user', props.user)
      
      createUser( { username: props.user, version: pwLookup[pass] } )
        .then(navWithClickLog(nav, `/${path}`))
        .catch(e => console.log(e))

    }}>Login</button>
  </main>
  )
}

let article = {
  id: 0,
  user: "user1",
  link: "http://www.google.com",
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
  // articles[ind].link = Math.random() > .3 ? "/v1/0" : articles[ind].link
}


let Feed = props => {

  let user = window.localStorage.getItem('user')
  
  return (
    <div>
      <link rel="stylesheet" href='style.css'></link>
      <main>
        <h1>Welcome, {user}</h1>
        { props.articles.map(article => <Article key={article.id} article={article}/>) }
      </main>
    </div>
  )
}

function App() {
  let [user, setUser] = useState("")
  let login = <Login setUser={setUser} user={user}/>
  return (
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={login}/>
          <Route exact path='/login' element={login}/>
          <Route exact path='/:version/' element={<Feed articles={articles}/>}/>
          <Route exact path='/:version/:articleId' element={<Article fullscreen/>}/>
        </Routes>
      </BrowserRouter>
  );
}



export default App;
