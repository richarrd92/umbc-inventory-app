import React from 'react';
import './SubHeader.css';

const SubHeader = () => {
  return (
    <div className="page-header-wrapper">
      <div className="page-header-background background-pattern">
        <svg className="flag-pattern" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern patternTransform="rotate(-6) scale(250)" id="pattern" x="0" y="0" width="1" height="0.667" patternUnits="userSpaceOnUse" fill="currentColor">
              <path d="M.416.333V.222L.333.166v.112zM.084 0l.083.055V0zM.333.166V0H.25v.11L.167.056v.112L.25.223V.11zM0 0v.056l.084.056V0zM.167.333V.167L.084.112v.221zM.833.612L.75.556v.111h.083V.612l.083.055V.555L.833.5zM.916.555L1 .611V.333H.916z"></path>
              <path d="M.25.333v.023a.021.021 0 01.021.021V.39h.02a.021.021 0 010 .042h-.02v.048h.134V.46a.021.021 0 11.042 0v.02h.018A.021.021 0 01.485.5H.25v.144A.021.021 0 00.271.623V.612h.02a.021.021 0 100-.043h-.02V.521h.134v.02a.021.021 0 10.042 0v-.02h.018a.021.021 0 00.02-.02H.5V.388l.084.056V.333L.667.39V.333H.75v.111L.667.39V.5L.75.556V.444L.833.5V.333H.75V.31A.021.021 0 01.729.29V.277h-.02A.021.021 0 01.708.236h.02V.188H.596v.02a.021.021 0 11-.042 0v-.02H.535a.021.021 0 01-.02-.021H.5V0H.416v.222L.5.278v.055H.333V.278L.25.223z"></path>
              <path d="M.667.667V.501L.584.445v.222zM.75 0v.023a.021.021 0 01.021.02v.012h.02a.021.021 0 010 .043h-.02v.048h.134v-.02a.021.021 0 11.042 0v.02h.018a.021.021 0 01.02.02H1V0zM.729.044v.011h-.02a.021.021 0 000 .043h.02v.048H.595v-.02A.021.021 0 10.553.125v.02H.535a.021.021 0 00-.02.022H.75V.023a.021.021 0 00-.021.02zM.926.229A.021.021 0 00.947.208v-.02h.018a.021.021 0 00.02-.021H.75V.31A.021.021 0 00.771.29V.277h.02a.021.021 0 100-.042h-.02V.188h.134v.02a.021.021 0 00.021.02zM.229.623V.612h-.02a.021.021 0 110-.043h.02V.521H.095v.02a.021.021 0 11-.042 0v-.02H.035a.021.021 0 01-.02-.02H0v.166h.25V.644A.021.021 0 01.229.623zM.229.377V.39h-.02a.021.021 0 000 .042h.02v.048H.095V.46a.021.021 0 10-.042 0v.02H.035A.021.021 0 00.015.5H.25V.356a.021.021 0 00-.021.021z"></path>
            </pattern>
          </defs>
          <rect fill="url(#pattern)" width="100%" height="100%"></rect>
        </svg>
      </div>
      <div className="page-header-content">
        <div className="container">
          <h2 className="h1 page-header-title">Retriever Essentials Inventory</h2>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
