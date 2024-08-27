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

import * as d3 from 'd3';
import * as d3_jp from 'd3-jetpack';

d3.keys(d3_jp).forEach(key => {
  try {
    d3[key] = d3_jp[key];
  } catch (e) {
  }
});

import {graphLevel} from './visualizations/graph-level';
import {LayerwiseTrace} from './visualizations/layerwise_trace'; // layers
import {nodeLevel} from './visualizations/node-level';
import {pcaLayers} from './visualizations/pca-layers'; // needed for styles
import {nodeStep} from './visualizations/node-step'; // update rule state transition
import {nodeStepSmall} from './visualizations/node-step-small'; // update rule simple
import { GraphDescription } from './visualizations/graph-description'; // simple nodes and edges visual definition

import { GraphDescriptionEmbeddings } from './visualizations/graph-description-embeddings';

window.onload = function() {
  pcaLayers();
  nodeStepSmall();
  nodeLevel();
  graphLevel();
  nodeStep();
  new LayerwiseTrace();
  new GraphDescription();
  new GraphDescriptionEmbeddings();
};
