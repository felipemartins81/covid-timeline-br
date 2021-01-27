function isMobileScreen() {
   return (window.screen.width < 600) ? true : false;
}

function resetHeaderScript() {
   const tagId = 'twitter-widget-js';
   const oldScript = document.getElementById(tagId);
   oldScript.remove();
   setTimeout(() => {
      const head = document.getElementsByTagName('head')[0];
      const script = document.createElement('script');
      script.id = tagId;
      script.type = 'text/javascript';
      script.src = './twitter-widget.js';
      script.charset = 'utf-8';
      script.async = true;
      head.appendChild(script);
   });
}

function windowScrollRight() {
   window.scroll(10000,0);
}

const tweets = [];
function addTweet(date, count, showPrevious=false, content) {
   const _content = content.replace('data-partner="tweetdeck"', ''); // data-theme="dark"
   const tweetContent = showPrevious ? _content : _content.replace('-tweet">', '-tweet" data-conversation="none">');
   tweets.push({
      date: date,
      count: count,
      content: tweetContent.replace('<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>', '')
   });
}

let chart;
window.onload = function() {
   let openedTooltip = null;
   const ctx = document.getElementById('chart').getContext('2d');
   chart = new Chart(ctx, {
      type: 'bar',
      data: {
         labels: tweets.map(e => e.date),
         datasets: [   
            {
               type: 'line',
               label: 'dataset 1',
               backgroundColor: 'rgba(255, 0, 0, 0.1)',
               borderColor: '#9c3975',
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
         maintainAspectRatio: false,
         layout: {
            padding: { left:20, right:20, top:20, bottom:20 }
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
               tooltipEl.style.top = (position.top + window.pageYOffset + tooltipModel.caretY + 15) + 'px';
               tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
               tooltipEl.style.fontSize = '16px';
               // tooltipEl.style.maxWidth = '500px';
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
                  if (item.index > (tweets.length - 15)) {
                     setTimeout(() => {
                        windowScrollRight();
                     }, 1000);
                  }
               }, 
            },
         },
         plugins: {
            // zoom: {
            //    pan: {
            //       enabled: true,
            //       mode: 'xy', // xy
            //       rangeMin: { y: -50000 },
            //       rangeMax: { y:300000 }
            //    },
            //    // zoom: {
            //    //    enabled: true, // scroll
            //    //    mode: 'xy', // xy
            //    //    rangeMin: { y: 0 }
            //    // }
            // }
         },
         onClick: function (event, activeElements) {
            if (!activeElements.length) {
               removeTooltips();
            }
         }
      }
   });
}

function removeTooltips() {
   const toolTip = document.getElementById('chartjs-tooltip');
   if (toolTip) {
      toolTip.remove();
      openedTooltip = null;
   }
}

function updateChartData(date, count, showPrevious=false, content) {
   addTweet(date, count, showPrevious, content);
   chart.data.labels.push(date);
   chart.data.datasets.forEach(e => e.data.push(count));
   chartUpdate();
}

function chartUpdate() {
   chart.update();
   setPageLayout();
}

function setPageLayout() {
   const screenSlice = isMobileScreen() ? 40 : 30;
   document.body.style.width = (tweets.length * screenSlice) + 'px';
   
   document.getElementById('chart-container').style.width = (tweets.length * screenSlice) + 'px'; //'2000px';

   if (isMobileScreen()) {
      document.getElementById('chart-container').style.height = '400px';
      document.getElementById('chart-container').style.position = 'relative';
   }
   else {
      document.getElementById('chart-container').style.height = '600px';
      setTimeout(() => {
         document.body.style.overflow = 'hidden';
      }, 1000);
      setTimeout(() => {
         document.body.style.overflow = 'scroll';
      }, 1050);
   }
}

document.addEventListener('click', function (click) {
   if (click.path[0].nodeName != 'CANVAS') {
      removeTooltips();
   }
   click.stopPropagation();
});