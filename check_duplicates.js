const fs = require('fs');
const content = fs.readFileSync('./src/components/cloud-maps.tsx', 'utf8');

const services = {
  GCP: {},
  AWS: {},
  Azure: {},
  OCI: {},
  IBM: {}
};

// Extract services for each provider
const providers = ['GCP', 'AWS', 'Azure', 'OCI', 'IBM'];
const categories = ['compute', 'storage', 'database', 'analytics', 'ai-ml', 'networking', 'data-integration'];

providers.forEach(provider => {
  categories.forEach(cat => {
    const pattern = provider === 'Azure' ? `AzureServices` : provider === 'OCI' ? `OCIServices` : provider === 'IBM' ? `IBMServices` : provider === 'AWS' ? `AWSServices` : `GCPServices`;
    if (!services[provider][cat]) services[provider][cat] = [];
  });
});

// Parse the file to extract services
let currentProvider = null;
let currentCategory = null;
let inArray = false;

content.split('\n').forEach(line => {
  if (line.includes('export const GCPServices')) currentProvider = 'GCP';const fs = require('fs');
const content = fs.readFileSync('./src/components/cloud-elconst content = fs.readFpo
const services = {
  GCP: {},
  AWS: {},
  Azure: {},
  OCI: {},
  IBM: {des  GCP: {},
  AWS:IS  AWS: {})   Azure: ov  OCI: {},
';  IBM: {}f };

// Ecl
desconst providers = ['GCP', 'AWS', 'AztPconst categories = ['compute', 'storage', 'database', 'lu
providers.forEach(provider => {
  categories.forEach(cat => {
    const pattern = provider === 'Azure' ? `Azlse  categories.forEach(cat => {
tC    const pattern = provide'))    if (!services[provider][cat]) services[provider][cat] = [];
  });
});

// Parse the file to extract services
let currentProvider = null;
let currentCategory = null;
let inArray = fa;
  });
});

// Parse the file to extract services
let currentPr D});
CA
/ CHlet currentProvider = null;
let currdelet currentCategory = nullprlet inArray = false;

contca
content.split('\n'gor  if (line.includes('export const GCceconst content = fs.readFileSync('./src/components/cloud-elconst const dups = [];
    serviceList.foconst services = {
  GCP: {},
  AWS: {},
  Azure: {},
  OCI: {},
  IBM: {des  GCP: ;
  GCP: {},
  AWS:th  AWS: {}    Azure: e.  OCI: {},
at  IBM: {dat  AWS:IS  AWS: {})  )}';  IBM: {}f };

// Ecl
desconst provid }
// Ecl
desconupldescos)providers.forEach(provider => {
  categories.forEach(cat => {
    const pattern = provider === 'Awi  categories.forEach(cat => {
('    const pattern = providerCAtC    const pattern = provide'))    if (!services[provider][cat]) services[prgo  });
});

// Parse the file to extract services
let currentProvider = null;
let currentCategoe:});
, 
/t: let currentProvider = null;
let curriceMap = {};
  allServices.forlet inArray = fa;
  });
})rv  });
});

// Pa])});
vi
/Maplet currentPr D});
CA
/ CHlet currenm.CA
/ CHlet currenat/;
let currdelet currentCategory bj
contca
content.split('\n'gor  if (line.includes('export  > conte i    serviceList.foconst services = {
  GCP: {},
  AWS: {},
  Azure: {},
  OCI: {},
  IBM: {des  GCP: ;
  GCP: {},
  AWS:th  AWS: {}    Azu.j  GCP: {},
  AWS: {},
  Azure: {},
er  AWS: {}t   Azure: on  OCI: {},
n\  IBM: {dIC  GCP: {},
  AWS:tro  AWS:th rEat  IBM: {dat  AWS:IS  AWS: {})  )}';  te
// Ecl
desconst provid }
// Ecl
desconupldescos)s[pdescoer// Ecl
desconupl  descol   categories.forEach(cat => {
    const patterto    const pattern =;
