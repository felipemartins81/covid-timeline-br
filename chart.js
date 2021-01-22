function resetHeaderScript() {
   const tagId = 'twitter-widget-js';
   const oldScript = document.getElementById(tagId);
   oldScript.remove();
   setTimeout(() => {
      const head = document.getElementsByTagName('head')[0];
      const script = document.createElement('script');
      script.id = tagId;
      script.type = 'text/javascript';
      script.src = 'https://platform.twitter.com/widgets.js';
      script.charset = 'utf-8';
      script.async = true;
      head.appendChild(script);
   });
}

const tweets = [];
function addTweet(date, count, showPrevious=false, content) {
   const tweetContent = showPrevious ? content : content.replace('-tweet">', '-tweet" data-conversation="none">'); // data-theme="dark"
   tweets.push({
      date: date,
      count: count,
      content: tweetContent.replace('<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>', '')
   });
}

window.onload = function() {
   let openedTooltip = null;
   const ctx = document.getElementById('chart').getContext('2d');
   const chart = new Chart(ctx, {
      type: 'bar',
      data: {
         labels: tweets.map(e => e.date),
         datasets: [   
            {
               type: 'line',
               label: 'dataset 1',
               backgroundColor: 'rgba(255, 0, 0, 0.1)',
               borderColor: 'rgba(255, 0, 0, 1)',
               data: tweets.map(e => e.count),
               pointRadius: 10,
               pointHoverRadius: 15
            },
            {
               type: 'bar',
               label: 'dataset 2',
               backgroundColor: 'rgba(0, 0, 0, 0.1)',
               borderColor: 'rgba(0, 0, 0, 1)',
               data: tweets.map(e => e.count)
            }
         ]
      },
      options: {
         legend: null,
         layout: {
            padding: { left:20, right:20, top:10, bottom:10 }
         },
         events: ['click'],
         tooltips: {
            enabled: false,
            custom: function(tooltipModel) {
               var tooltipEl = document.getElementById('chartjs-tooltip');
               if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = '<article></article>';
                  document.body.appendChild(tooltipEl);
               }
               var position = this._chart.canvas.getBoundingClientRect();
               tooltipEl.style.opacity = 1;
               tooltipEl.style.position = 'absolute';
               tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
               tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
               tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
               tooltipEl.style.fontSize = '16px';
               tooltipEl.style.maxWidth = '500px';
            },
            callbacks: {
               label: (item, data) => {
                  if (item.index == openedTooltip) {
                     return;
                  }
                  openedTooltip = item.index;
                  setTimeout(() => {
                     var tooltipEl = document.getElementById('chartjs-tooltip');
                     var tooltipTemplate = tweets[ item.index ].content;
                     var tooltipContainer = tooltipEl.querySelector('article');
                     tooltipContainer.innerHTML = tooltipTemplate;
                  });
                  resetHeaderScript();
               }, 
            },
         },
         plugins: {
            zoom: {
               pan: {
                  enabled: true,
                  mode: 'y', // xy
                  rangeMin: { y: -5 }
               },
               zoom: {
                  enabled: true, // scroll
                  mode: 'xy', // xy
                  rangeMin: { y: -5 }
               }
            }
         },
         onClick: function (event, activeElements) {
            if (!activeElements.length) {
               removeTooltips();
            }
         }
      }
   });

   function removeTooltips() {
      const toolTip = document.getElementById('chartjs-tooltip');
      if (toolTip) {
         toolTip.remove();
         openedTooltip = null;
      }
   }
}

function setPageLayout() {
   console.warn(tweets.length);
   // document.getElementById('chart-container').style.width = '2000px';
   // document.getElementById('chart-container').style.height = '800px';
   // document.body.style.paddingRight = '200px';

}

// document.addEventListener('click', function (click) {
   // click.stopPropagation();
// });