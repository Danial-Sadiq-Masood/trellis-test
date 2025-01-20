import * as trellis from '@sayari/trellis'

import * as renderers from '@sayari/trellis/renderers/webgl/index'

import * as layouts from '@sayari/trellis/layout/force/index'

import pixiGraph from './pixiGraph.json'

import userSVG from './user-circle.svg'

window.trellis = trellis;

console.log(renderers);
console.log(layouts);

//data
const nodeData = pixiGraph.nodes

var edges = pixiGraph.links

edges = edges.map((e, i) => ({
  ...e, id: i, style: {
    arrow: 'forward'
  }
}))

const NODE_STYLE = {
  color: '#7CBBF3',
  labelSize: 10,
  labelWordWrap: 260,
  stroke: [{ color: '#FFF', width: 2 }],
  icon: { type: 'imageIcon', url: userSVG, scale: 0.3 },
  badge: [{
    position: 45,
    color: '#7CBBF3',
    stroke: '#FFF',
    icon: {
      type: 'textIcon',
      family: 'Helvetica',
      size: 10,
      color: '#FFF',
      text: '8',
    }
  },
  {
    position: 135,
    color: '#7CBBF3',
    stroke: '#FFF',
    icon: {
      type: 'textIcon',
      family: 'Helvetica',
      size: 10,
      color: '#FFF',
      text: '8',
    }
  },
  {
    position: 315,
    color: '#7CBBF3',
    stroke: '#FFF',
    icon: {
      type: 'textIcon',
      family: 'Helvetica',
      size: 10,
      color: '#FFF',
      text: '8',
    }
  }
  ],
}

const nodes = nodeData.map((node) => ({ ...node, label: node.id, style: NODE_STYLE, radius: 18 }))

const layout = layouts.Layout()

const container = document.getElementById('graph')

const render = renderers.Renderer({ container })
//invalidation.then(() => render.delete())

layout({
  nodes: nodes, edges: edges,
  options: {
    nodePadding: 40
  }
}).then(({ nodes, edges }) => {
  const { x, y, zoom } = trellis.boundsToViewport(
    trellis.getSelectionBounds(nodes, 40),
    { width: container.clientWidth, height: container.clientHeight }
  )

  const options = {
    x,
    y,
    zoom,
    width: container.clientWidth,
    height: container.clientHeight,
    onViewportDrag: ({ viewportX, viewportY }) => {
      options.x = viewportX
      options.y = viewportY
      render({ nodes, edges, options })
    },
    onViewportWheel: ({ viewportX, viewportY, viewportZoom }) => {
      options.x = viewportX
      options.y = viewportY
      options.zoom = viewportZoom
      render({ nodes, edges, options })
    },
    onNodeDrag: ({ nodeX: x, nodeY: y, target: { id } }) => {
      nodes = nodes.map((node) => node.id === id ? { ...node, x, y } : node)
      render({ nodes, edges, options })
    },
    onNodePointerEnter: ({ target }) => {
      nodes = nodes.map((node) => target.id === node.id ? {
        ...node,
        style: {
          ...node.style,
          stroke: [...node.style.stroke, { color: '#ccc', width: 2 }]
        }
      } : node)
      render({ nodes, edges, options })
    },
    onNodePointerLeave: ({ target }) => {
      nodes = nodes.map((n) => target.id === n.id ? ({ ...n, style: NODE_STYLE }) : n)
      render({ nodes, edges, options })
    }
  }

  render({ nodes, edges, options })
})