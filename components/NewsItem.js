import React from 'react'

function NewsItem(props) {
    return (
    <div className="news-item">
        <div className="news-image-container sm:basis-4/12">
            <a href={props.url} target="_blank" rel="noreferrer">
              <img className="news-image" alt="news-story" src={props.image}></img>
            </a>
        </div>
        <div className="news-content sm:basis-8/12">
            <a href={props.url} target="_blank" rel="noreferrer" className="news-title-link">
              <span className="news-title">{props.title}</span>
            </a>
            <span className="news-source my-2">
                {props.source}
            </span>
            <p className="news-text">
                {props.text}
            </p>
        </div>
    </div>
    )
}

export default NewsItem;
