/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */


import * as d3 from 'd3'
import * as d3_jp from 'd3-jetpack'
import * as _ from 'underscore'
import {swoopyDrag} from '../third_party/swoopy-drag'
import { random } from '../utils';
import { createBipartiteGraph } from './graph-helpers'

export function nodeStepSmall() {
  var width = 150
  var barWidth = 100
  var xOffset = 0
  var height = 200
  var numEmbed = 8
  var sel = d3.select('#node-step-small').html('')

  var { nodes, links } = window.stepNodesSm = window.stepNodesSm ||
    createBipartiteGraph(3, 2, {
      numEmbed: numEmbed
    });

  window.stepLinksSm = window.stepLinksSm || links;

  var n = nodes.length

  var renderFns = []
  function render(){
    renderFns.forEach(d => d())
  }


  var c = d3.conventions({
    sel: sel.append('div').st({margin: '0px auto'}),
    width: 250,
    height: 250,
    margin: {top: 70},
  })

  function drawGraph(){
    var g = c.svg.append('g').translate(d => [width/2 + xOffset, height/2 - 60])
    var r = Math.min(width, height)/2

    nodes.forEach(d => {
      d.pos = [Math.cos(Math.PI/6 + d.i/n*Math.PI*2)*r, Math.sin(Math.PI/6 + d.i/n*Math.PI*2)*r]
    })

    links.forEach(d => {
      d.pathStr = 'M' + [d.a, d.b].map(d => d.pos).join('L')
    })

    var linkSel = g.append('g').appendMany('path.link', links)
      .at({
        d: d => d.pathStr,
        strokeWidth: 2,
      })

    var nodeSel = g.appendMany('circle.node', nodes)
      .translate(d => d.pos)
      .at({r: 10})

    renderFns.push(() => {
      nodeSel.at({
        fill: '#fff', 
        stroke: (d) => d.hover ? '#000' : '#aaa',
        strokeWidth: 1,
      })

      linkSel.at({
        stroke: d => d.color, 
        strokeWidth: d => d.v ? (d.hover ? 8 : 4) : 0
      })
      .filter(d => d.hover)
      .raise()
    })

    xOffset += width + 60
  }

  var bw = Math.floor(barWidth/numEmbed)
  var bh = bw*1
  var bpad = 10

  function drawAdditionCol(){
    var g = c.svg.append('g').translate([xOffset, 40.5])

    var allEmbeds = _.flatten(nodes.map(d => d.embed))
    allEmbeds.forEach(d => {
      d.height = Math.round(d.v*bh)
    })

    var botSel = g.append('g').translate((bh + bpad)*(nodes.length - 1), 1)
    var seperateSel = g.appendMany('rect', allEmbeds)
    var stackSel = botSel.append('g').translate(bpad*2, 1).appendMany('rect', allEmbeds)

    botSel.append('path').at({
      d: `M 0 ${bpad} H ${bw*numEmbed}`,
      stroke: '#000',
    })

    botSel.append('text').text('+')
      .at({fontSize: 25, x: -25, fontWeight: 100, dy: '.33em', y: -bpad})
      .st({fontSize: 25})

    renderFns.push(() => {
      _.sortBy(nodes, d => d.hover ? 2 : d.neighbor ? 1 : 0)
        .forEach((d, i) => d.stackIndex = i)

      seperateSel
        .at({
          x: d => d.i*bw,
          width: bw - 1,
          height: d => d.height,
          y: d => (bh + bpad)*d.node.stackIndex - d.height,
          fill: d => d.node.color,
          opacity: d => d.node.neighbor ? 1 : 0,
        })

      d3.nestBy(_.sortBy(allEmbeds, d => -d.node.stackIndex), d => d.i).forEach(col => {
        var prev = 0 
        col.forEach(d => {
          d.prev = prev
          prev += d.height
        })
      })

      stackSel
        .at({
          x: d => d.i*bw,
          width: bw - 1,
          height: d => d.height,
          y: d => d.prev - d.height*0,
          fill: d => d.node.color,
          opacity: d => d.node.neighbor ? 1 : 0,
        })
    })


    xOffset += width + 0
  }

  function addAnnotations(){
    var isDrag = 0

    const annotations = [
      {
        "text": "Aggregate information from adjacent edges",
        "textOffset": [
          189,
          228
        ]
      },
      {
        "path": "M 114,60 A 35.044 35.044 0 0 0 160,109",
        "srcIndex": 0
      },
      {
        "path": "M 52,51 A 80.808 80.808 0 0 0 183,145",
        "srcIndex": 1
      },
      {
        "path": "M 22,13 A 114.114 114.114 0 0 0 190,161",
        "srcIndex": 2
      },

      {
        "path": "M 140,32 A 43.963 43.963 0 0 1 189,35",
        "srcIndex": 3
      },
      {
        "path": "M 84,72 A 58.95 58.95 0 0 0 175,129",
        "srcIndex": 4
      },
      {
        "path": "M 63,18 A 78.02 78.02 0 0 1 219,14",
        "srcIndex": 5
      }
    ]
    // Calculate graph translation offset (using initial xOffset = 0)
    const gTranslate = [width/2, height/2 - 60];

    // Update annotation paths to originate from link midpoints
    annotations.forEach(d => {
      if (d.srcIndex !== undefined && d.path) {
        const link = links[d.srcIndex];
        if (link && link.a && link.b && link.a.pos && link.b.pos) {
          const midX = (link.a.pos[0] + link.b.pos[0]) / 2 + gTranslate[0];
          const midY = (link.a.pos[1] + link.b.pos[1]) / 2 + gTranslate[1];
          // Replace the M x,y part of the path string
          d.path = d.path.replace(/^M\s*[^\s,]+[\s,]+[^\sA]+/, `M ${midX.toFixed(1)},${midY.toFixed(1)}`);
        } else {
           console.warn(`Skipping annotation path update for srcIndex ${d.srcIndex}: Link or positions missing`);
        }
      }
    });

    var swoopy = swoopyDrag()
        .x(d => 0)
        .y(d => 0)
        .draggable(isDrag)
        .annotations(annotations)

    var swoopySel = c.svg.append('g.annotations').call(swoopy)

    c.svg.append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '-10 -10 20 20')
        .attr('markerWidth', 20)
        .attr('markerHeight', 20)
        .attr('orient', 'auto')
      .append('path')
        .attr('d', 'M-6.75,-6.75 L 0,0 L -6.75,6.75')

    swoopySel.selectAll('path')
      .attr('marker-end', 'url(#arrow)')
      .st({'opacity': d => d.path == 'M 0 0' ? 0 : 1})

    swoopySel.selectAll('text')
      .each(function(d){
        d3.select(this)
          .text('')                        //clear existing text
          .tspans(d3.wordwrap(d.text, d.width || 20), 16) //wrap after 20 char
      })

    var srcSwoops = swoopySel.selectAll('g')
      .filter(d => isFinite(d.srcIndex))
    renderFns.push(d => {
      srcSwoops
        .st({display: d => links[d.srcIndex].hover ? '' : 'none'})
    })  
  }

  function setHover(d){
    nodes.forEach(e => {
      e.hover = false
      e.neighbor = false
    })
    d.hover = true
    d.neighbor = true
    d.neighbors.forEach(e => {
      e.neighbor = true
    })

    links.forEach(l => {
      l.hover = l.a == d || l.b == d
    })

    if (!d.isNode){
      links.forEach(e => e.hover = e.linkId == d.linkId)
    }

    render()
  }


  drawGraph()
  drawAdditionCol()
  addAnnotations()

  sel.selectAll('.node')
    .on('mouseover', setHover)

  setHover(nodes[0])
}

if (module.hot) {
  nodeStepSmall()
  module.hot.accept()
}





