import './App.css';


function Article(props) {

  return (
    <article>
      <div class='profpic'></div>
      <span>Posted by {props.user}</span>
      <p>{props.body}</p>
      <h1>{props.headline}</h1>
    </article>
  );
  
}

let article = {
  user: "user1",
  link: "www.google.com",
  postTime: new Date(),
  image: "",
  body: `This is a really neat little site I found. This is a brief description of it, 
      and I thought you might like to check it out. In fact, here is another link 
      to check out while you're at it:
  `,
  headline: "Headline",
}

let articles = [ article, article, article ]

function App() {
  return (
    <div className="App">
      <link rel="stylesheet" href='style.css'></link>
      <main>
        { articles.map(article => <Article {...article}/>) }
      </main>
    </div>
  );
}

export default App;
