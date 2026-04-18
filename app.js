require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/geometry/geometryEngine",
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/geometry/projection",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleFillSymbol"
], function(
  Map,
  MapView,
  Graphic,
  GraphicsLayer,
  FeatureLayer,
  geometryEngine,
  Point,
  Polyline,
  projection,
  SimpleLineSymbol,
  SimpleMarkerSymbol,
  SimpleFillSymbol
) {
  const PUBLIC_LAYER_URL = "https://services-eu1.arcgis.com/GdMgNbOLlUGHT4ZK/arcgis/rest/services/Ax_Dan/FeatureServer/0";

  // --- i18n ---
  const TRANSLATIONS = {
    en: {
      satellite: "Satellite", map: "Map", center: "⊕ Center",
      track: "Track", stakeout: "Stakeout",
      chainage: "Chainage", offset: "Offset", targetKm: "Target KM", distance: "Distance",
      shareBtn: "↑ Share", setTarget: "Set Target", takePhoto: "Take Photo",
      shareSelected: "Share Selected", close: "Close",
      project: "Project", alignment: "Alignment",
      selectProject: "Select project", selectProjectFirst: "Select a project first",
      selectAlignment: "Select alignment",
      noAlignment: "No alignment selected",
      loadingAlignments: "Loading alignments...",
      chooseProject: "Choose a project, then select an alignment.",
      selectAnAlignment: "Select an alignment.",
      selectAProject: "Select a project.",
      selectAlignmentFirst: "Select an alignment first.",
      trackModeReady: "Track mode ready.",
      alignmentOutOfBounds: "Alignment out of bounds.",
      enterTargetChainage: "Enter a target chainage or click on the map.",
      stakeoutTargetSet: "Stakeout target set. Start GPS or double-click to guide to it.",
      invalidChainage: "Enter a whole-meter chainage like 1250 or 1+250. Decimals are not supported.",
      chainageOutsideAlignment: "Target chainage is outside this alignment.",
      unableToResolve: "Unable to resolve that target chainage.",
      clickCloser: "Click closer to the alignment to set a target.",
      chooseProjectFirst: "Choose a project first.",
      selectAlignmentSimulate: "Select an alignment before simulating a position.",
      failedToLoad: "Failed to load public alignment layer.",
      loadFailed: "Load failed", unavailable: "Unavailable",
      nearestLocation: "nearest to your location",
      shareEyebrow: "Share", shareTitle: "Share current position",
      currentData: "Current data", coordsLabel: "Coordinates",
      capturedPhotos: "Captured photos", waitingGps: "Waiting for GPS",
      noPhotosCaptured: "No photos captured yet.",
      shareNote1: "Native sharing is unavailable here. The app will fall back to a text-only share link.",
      shareNote2: "This browser may share the tracker text but not attach the selected photos.",
      shareNote3: "Take one or more photos, then tap the ones you want to include.",
      shareNote4: "Selected photos will be shared together with the current tracker details.",
      photoEmptyState: "No photos yet. Use <strong>Take Photo</strong> to capture one from the camera.",
      shareAppTitle: "Alignment Tracker",
      shareProjectLabel: "Project", shareAlignmentLabel: "Alignment",
      shareChainageLabel: "Chainage", shareTargetLabel: "Target",
      shareOffsetLabel: "Offset", shareDistanceLabel: "Distance",
      shareCoords: "Coords", shareTime: "Time",
      cardinals: ["N","NE","E","SE","S","SW","W","NW"],
      stakeoutPlaceholder: "1250 or 1+250"
    },
    ro: {
      satellite: "Satelit", map: "Hartă", center: "⊕ Centrare",
      track: "Urmărire", stakeout: "Implantare",
      chainage: "Km", offset: "Offset", targetKm: "Km Țintă", distance: "Distanță",
      shareBtn: "↑ Partajare", setTarget: "Setează Ținta", takePhoto: "Fotografiază",
      shareSelected: "Partajează Selectate", close: "Închide",
      project: "Proiect", alignment: "Ax",
      selectProject: "Selectează proiect", selectProjectFirst: "Selectează mai întâi un proiect",
      selectAlignment: "Selectează ax",
      noAlignment: "Niciun ax selectat",
      loadingAlignments: "Se încarcă axele...",
      chooseProject: "Alege un proiect, apoi selectează un ax.",
      selectAnAlignment: "Selectează un ax.",
      selectAProject: "Selectează un proiect.",
      selectAlignmentFirst: "Selectează mai întâi un ax.",
      trackModeReady: "Modul urmărire activ.",
      alignmentOutOfBounds: "Ax în afara limitelor.",
      enterTargetChainage: "Introdu un km țintă sau apasă pe hartă.",
      stakeoutTargetSet: "Ținta setată. Pornește GPS sau dublu-click pentru ghidare.",
      invalidChainage: "Introdu un km întreg, ex: 1250 sau 1+250. Zecimalele nu sunt acceptate.",
      chainageOutsideAlignment: "Km țintă este în afara acestui ax.",
      unableToResolve: "Nu se poate rezolva km țintă.",
      clickCloser: "Apasă mai aproape de ax pentru a seta o țintă.",
      chooseProjectFirst: "Alege mai întâi un proiect.",
      selectAlignmentSimulate: "Selectează un ax înainte de a simula o poziție.",
      failedToLoad: "Eroare la încărcarea stratului de axe.",
      loadFailed: "Eroare la încărcare", unavailable: "Indisponibil",
      nearestLocation: "cel mai apropiat de locația ta",
      shareEyebrow: "Partajare", shareTitle: "Partajează poziția curentă",
      currentData: "Date curente", coordsLabel: "Coordonate",
      capturedPhotos: "Fotografii capturate", waitingGps: "Se așteaptă GPS",
      noPhotosCaptured: "Nicio fotografie capturată.",
      shareNote1: "Partajarea nativă nu este disponibilă. Aplicația va folosi un link text.",
      shareNote2: "Browserul poate partaja textul, dar nu și fotografiile selectate.",
      shareNote3: "Fă una sau mai multe fotografii, apoi apasă pe cele pe care vrei să le incluzi.",
      shareNote4: "Fotografiile selectate vor fi partajate cu detaliile curente.",
      photoEmptyState: "Nicio fotografie. Folosiți <strong>Fotografiază</strong> pentru a captura una.",
      shareAppTitle: "Tracker Ax",
      shareProjectLabel: "Proiect", shareAlignmentLabel: "Ax",
      shareChainageLabel: "Km", shareTargetLabel: "Țintă",
      shareOffsetLabel: "Offset", shareDistanceLabel: "Distanță",
      shareCoords: "Coord", shareTime: "Ora",
      cardinals: ["N","NE","E","SE","S","SV","V","NV"],
      stakeoutPlaceholder: "1250 sau 1+250"
    }
  };

  let currentLang = "en";
  let _statusKey = null;
  function t(key) { return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || TRANSLATIONS.en[key] || key; }

  // --- State ---
  let allAlignments = [];
  let filteredAlignments = [];
  let selectedAlignment = null;
  let gpsWatchId = null;
  let userGraphic = null;
  let nearestGraphic = null;
  let connectLineGraphic = null;
  let projectionReady = false;
  let currentBasemapMode = "map";
  let activeMode = "track";
  let stakeoutTarget = null;
  let targetGraphic = null;
  let stakeoutLineGraphic = null;
  // GPS accuracy & smoothing
  let lastAccuracy = Infinity;
  let smoothedPoint = null;
  let wasArrived = false;
  let lastRawMapPt = null;
  let accuracyGraphic = null;
  let wakeLock = null;
  let lastHeading = null;
  let lastWGS84 = null;
  let capturedPhotos = [];
  let photoIdCounter = 0;
  let autoSelectDone = false;
  const GPS_ALPHA = 0.4;

  // --- Element refs ---
  const projectSelect = document.getElementById("projectSelect");
  const alignmentSelect = document.getElementById("alignmentSelect");
  const alignmentNameEl = document.getElementById("alignmentName");
  const stationDisplayEl = document.getElementById("stationDisplay");
  const primaryMetricLabelEl = document.getElementById("primaryMetricLabel");
  const secondaryMetricLabelEl = document.getElementById("secondaryMetricLabel");
  const chainageValueEl = document.getElementById("chainageValue");
  const offsetValueEl = document.getElementById("offsetValue");
  const offsetDirEl = document.getElementById("offsetDir");
  const statusMsgEl = document.getElementById("statusMsg");
  const gpsIndicatorEl = document.getElementById("gpsIndicator");
  const btnBasemapEl = document.getElementById("btnBasemap");
  const btnRecenterEl = document.getElementById("btnRecenter");
  const btnShareEl = document.getElementById("btnShare");
  const btnTrackModeEl = document.getElementById("btnTrackMode");
  const btnStakeoutModeEl = document.getElementById("btnStakeoutMode");
  const stakeoutRowEl = document.getElementById("stakeoutRow");
  const stakeoutInputEl = document.getElementById("stakeoutInput");
  const gpsAccuracyEl = document.getElementById("gpsAccuracy");
  const shareOverlayEl = document.getElementById("shareOverlay");
  const photoInputEl = document.getElementById("photoInput");
  const photoStripEl = document.getElementById("photoStrip");
  const photoEmptyStateEl = document.getElementById("photoEmptyState");
  const shareProjectValueEl = document.getElementById("shareProjectValue");
  const shareAlignmentValueEl = document.getElementById("shareAlignmentValue");
  const sharePrimaryKeyEl = document.getElementById("sharePrimaryKey");
  const sharePrimaryValueEl = document.getElementById("sharePrimaryValue");
  const shareSecondaryKeyEl = document.getElementById("shareSecondaryKey");
  const shareSecondaryValueEl = document.getElementById("shareSecondaryValue");
  const shareCoordsValueEl = document.getElementById("shareCoordsValue");
  const shareSelectionSummaryEl = document.getElementById("shareSelectionSummary");
  const shareSupportNoteEl = document.getElementById("shareSupportNote");
  const btnShareSelectedEl = document.getElementById("btnShareSelected");
  const langSelectEl = document.getElementById("langSelect");

  const basemapModes = {
    map: "dark-gray-vector",
    satellite: "hybrid"
  };

  // --- Utilities ---
  function log(msg) {
    console.log(msg);
    const el = document.getElementById("debugLog");
    el.innerHTML += msg + "<br>";
    el.scrollTop = el.scrollHeight;
  }

  window.toggleDebug = function() {
    document.getElementById("debugLog").classList.toggle("visible");
  };

  function setStatus(message) {
    _statusKey = null;
    statusMsgEl.textContent = message;
  }

  function setStatusKey(key) {
    _statusKey = key;
    statusMsgEl.textContent = t(key);
  }

  function applyBasemapMode(mode) {
    currentBasemapMode = mode;
    map.basemap = basemapModes[mode];
    btnBasemapEl.textContent = mode === "map" ? t("satellite") : t("map");
    btnBasemapEl.classList.toggle("active", mode === "satellite");
  }

  function formatChainage(meters, precision) {
    if (!Number.isFinite(meters)) return "--";
    const p = precision || 0;
    const sign = meters < 0 ? "-" : "";
    const abs = Math.abs(meters);
    const km = Math.floor(abs / 1000);
    const m = abs % 1000;
    if (p === 0) {
      return sign + km + "+" + String(Math.round(m)).padStart(3, "0");
    }
    const mFixed = m.toFixed(p);
    const mParts = mFixed.split(".");
    return sign + km + "+" + String(mParts[0]).padStart(3, "0") + "." + mParts[1];
  }

  function updateAccuracyDisplay(accuracy) {
    lastAccuracy = accuracy;
    if (!gpsAccuracyEl) return;
    gpsAccuracyEl.textContent = "\u00b1" + Math.round(accuracy) + "m";
    gpsAccuracyEl.className = "gps-accuracy " + (accuracy <= 5 ? "good" : accuracy <= 15 ? "warn" : "bad");
  }

  function bearingToTarget(fromPt, toPt) {
    const dx = toPt.x - fromPt.x;
    const dy = toPt.y - fromPt.y;
    const deg = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
    const cardinal = t("cardinals")[Math.round(deg / 45) % 8];
    return cardinal + " " + Math.round(deg) + "\u00b0";
  }

  function normalizeProjectName(value) {
    return String(value == null ? "" : value).trim() || "Unassigned";
  }

  function normalizeAlignmentName(value, fallbackIndex) {
    return String(value == null ? "" : value).trim() || ("Alignment " + fallbackIndex);
  }

  function formatHemisphere(value, positive, negative) {
    if (!Number.isFinite(value)) {
      return "--";
    }
    return Math.abs(value).toFixed(6) + "\u00b0" + (value >= 0 ? positive : negative);
  }

  function buildSharePayload() {
    const chainage = chainageValueEl.textContent.trim() || "--";
    const offset = offsetValueEl.textContent.trim() || "--";
    const directionBadge = offsetDirEl.querySelector(".offset-direction");
    const secondarySuffix = directionBadge
      ? directionBadge.textContent.trim()
      : offsetDirEl.textContent.replace(/^m\s*/, "").trim();
    const _d = new Date();
    const date = String(_d.getDate()).padStart(2, "0") + "/" + String(_d.getMonth() + 1).padStart(2, "0") + "/" + _d.getFullYear();
    const time = new Date().toLocaleTimeString();
    const isTrackMode = activeMode === "track";
    const primaryLabel = isTrackMode ? t("shareChainageLabel") : t("shareTargetLabel");
    const secondaryLabel = isTrackMode ? t("shareOffsetLabel") : t("shareDistanceLabel");
    const secondaryValue = isTrackMode
      ? (offset === "--" ? "--" : offset + " m" + (secondarySuffix ? " " + secondarySuffix : ""))
      : (offset === "--" ? "--" : offset + " m" + (secondarySuffix ? " | " + secondarySuffix : ""));
    const coordsText = lastWGS84
      ? formatHemisphere(lastWGS84.lat, "N", "S") + ", " + formatHemisphere(lastWGS84.lon, "E", "W")
      : t("waitingGps");

    const lines = [t("shareAppTitle") + " - " + date];
    if (selectedAlignment) {
      lines.push(t("shareProjectLabel") + ": " + selectedAlignment.project);
      lines.push(t("shareAlignmentLabel") + ": " + selectedAlignment.name);
    }
    lines.push(primaryLabel + ": " + chainage);
    lines.push(secondaryLabel + ": " + secondaryValue);
    if (lastWGS84) {
      const lat = lastWGS84.lat.toFixed(6);
      const lon = lastWGS84.lon.toFixed(6);
      const accuracy = lastAccuracy < Infinity ? " (\u00b1" + Math.round(lastAccuracy) + "m)" : "";
      lines.push(t("shareCoords") + ": " + coordsText + accuracy);
      lines.push("Maps: https://maps.google.com/?q=" + lat + "," + lon);
    }
    lines.push(t("shareTime") + ": " + time);

    return {
      text: lines.join("\n"),
      summary: {
        project: selectedAlignment ? selectedAlignment.project : "--",
        alignment: selectedAlignment ? selectedAlignment.name : "--",
        primaryLabel: primaryLabel,
        primaryValue: chainage,
        secondaryLabel: secondaryLabel,
        secondaryValue: secondaryValue,
        coords: coordsText
      }
    };
  }

  // Cache the PORR logo so it's only fetched once per session
  var _porrLogoImg = null;
  var _porrLogoPromise = null;
  function loadPorrLogo() {
    if (_porrLogoImg) return Promise.resolve(_porrLogoImg);
    if (_porrLogoPromise) return _porrLogoPromise;
    _porrLogoPromise = new Promise(function(resolve) {
      var logoImg = new Image();
      logoImg.onload = function() { _porrLogoImg = logoImg; resolve(logoImg); };
      logoImg.onerror = function() { resolve(null); };
      logoImg.src = "Porr_logo.svg";
    });
    return _porrLogoPromise;
  }

  function addTextOverlayToPhoto(file, text) {
    return new Promise(function(resolve) {
      var url = URL.createObjectURL(file);
      var img = new Image();

      img.onerror = function() {
        URL.revokeObjectURL(url);
        resolve(file);
      };

      img.onload = function() {
        URL.revokeObjectURL(url);

        loadPorrLogo().then(function(logoImg) {
          var canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          var ctx = canvas.getContext("2d");

          ctx.drawImage(img, 0, 0);

          var shortSide = Math.min(img.naturalWidth, img.naturalHeight);
          var fontSize = Math.max(18, Math.min(56, Math.round(shortSide * 0.018)));
          var lineHeight = Math.round(fontSize * 1.45);
          var padding = Math.round(fontSize * 0.85);
          var cornerMargin = Math.round(fontSize * 0.9);

          // --- PORR logo — top-right corner ---
          if (logoImg) {
            // viewBox 113.38 x 72.45  →  aspect ≈ 1.565
            var logoW = Math.max(60, Math.min(280, Math.round(shortSide * 0.14)));
            var logoH = Math.round(logoW * (72.45 / 113.38));
            var logoX = canvas.width - logoW - cornerMargin;
            var logoY = cornerMargin;
            ctx.globalAlpha = 0.92;
            ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
            ctx.globalAlpha = 1.0;
          }

          // --- Text box — bottom-right corner ---
          ctx.font = "bold " + fontSize + "px -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif";
          var lines = text.split("\n").filter(Boolean);
          var maxWidth = 0;
          lines.forEach(function(line) {
            var w = ctx.measureText(line).width;
            if (w > maxWidth) maxWidth = w;
          });

          var boxW = maxWidth + padding * 2;
          var boxH = lines.length * lineHeight + padding * 2;
          var boxX = canvas.width - boxW - cornerMargin;
          var boxY = canvas.height - boxH - cornerMargin;
          var radius = Math.round(fontSize * 0.4);

          // PORR blue background
          ctx.globalAlpha = 0.88;
          ctx.fillStyle = "#143E6F";
          if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(boxX, boxY, boxW, boxH, radius);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.moveTo(boxX + radius, boxY);
            ctx.lineTo(boxX + boxW - radius, boxY);
            ctx.quadraticCurveTo(boxX + boxW, boxY, boxX + boxW, boxY + radius);
            ctx.lineTo(boxX + boxW, boxY + boxH - radius);
            ctx.quadraticCurveTo(boxX + boxW, boxY + boxH, boxX + boxW - radius, boxY + boxH);
            ctx.lineTo(boxX + radius, boxY + boxH);
            ctx.quadraticCurveTo(boxX, boxY + boxH, boxX, boxY + boxH - radius);
            ctx.lineTo(boxX, boxY + radius);
            ctx.quadraticCurveTo(boxX, boxY, boxX + radius, boxY);
            ctx.closePath();
            ctx.fill();
          }
          ctx.globalAlpha = 1.0;

          // PORR yellow text
          ctx.font = "bold " + fontSize + "px -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif";
          ctx.fillStyle = "#FFED00";
          ctx.textAlign = "right";
          ctx.textBaseline = "top";
          ctx.shadowColor = "rgba(0,0,0,0.45)";
          ctx.shadowBlur = Math.round(fontSize * 0.2);
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;

          lines.forEach(function(line, i) {
            var textX = boxX + boxW - padding;
            var textY = boxY + padding + i * lineHeight;
            ctx.fillText(line, textX, textY);
          });

          ctx.shadowColor = "transparent";

          canvas.toBlob(function(blob) {
            if (!blob) {
              resolve(file);
              return;
            }
            var baseName = (file.name || "photo").replace(/\.[^.]+$/, "");
            var stamped = new File([blob], baseName + "_stamped.jpg", {
              type: "image/jpeg",
              lastModified: Date.now()
            });
            resolve(stamped);
          }, "image/jpeg", 0.92);
        }); // end loadPorrLogo().then
      };

      img.src = url;
    });
  }

  function getSelectedPhotos() {
    return capturedPhotos.filter(function(photo) {
      return photo.selected;
    });
  }

  function canShareFiles(files) {
    if (!navigator.share || !navigator.canShare || !files.length) {
      return false;
    }

    try {
      return navigator.canShare({ files: files });
    } catch (_) {
      return false;
    }
  }

  function updateShareSummary() {
    const summary = buildSharePayload().summary;
    const selectedCount = getSelectedPhotos().length;
    const totalCount = capturedPhotos.length;
    const selectedFiles = getSelectedPhotos().map(function(photo) {
      return photo.file;
    });

    shareProjectValueEl.textContent = summary.project;
    shareAlignmentValueEl.textContent = summary.alignment;
    sharePrimaryKeyEl.textContent = summary.primaryLabel;
    sharePrimaryValueEl.textContent = summary.primaryValue;
    shareSecondaryKeyEl.textContent = summary.secondaryLabel;
    shareSecondaryValueEl.textContent = summary.secondaryValue;
    shareCoordsValueEl.textContent = summary.coords;

    if (!totalCount) {
      shareSelectionSummaryEl.textContent = t("noPhotosCaptured");
    } else {
      shareSelectionSummaryEl.textContent = selectedCount + " of " + totalCount + " selected";
    }

    if (!navigator.share) {
      shareSupportNoteEl.textContent = t("shareNote1");
    } else if (selectedFiles.length && !canShareFiles(selectedFiles)) {
      shareSupportNoteEl.textContent = t("shareNote2");
    } else if (!selectedFiles.length) {
      shareSupportNoteEl.textContent = t("shareNote3");
    } else {
      shareSupportNoteEl.textContent = t("shareNote4");
    }

    btnShareSelectedEl.disabled = selectedCount === 0;
  }

  function renderSharePhotos() {
    photoStripEl.innerHTML = "";

    if (!capturedPhotos.length) {
      photoStripEl.appendChild(photoEmptyStateEl);
      updateShareSummary();
      return;
    }

    capturedPhotos.forEach(function(photo, index) {
      const item = document.createElement("div");
      item.className = "photo-item";
      item.id = "photo-item-" + photo.id;

      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "photo-thumb" + (photo.selected ? " selected" : "");
      thumb.setAttribute("aria-pressed", photo.selected ? "true" : "false");
      thumb.addEventListener("click", function() {
        togglePhotoSelection(photo.id);
      });

      const image = document.createElement("img");
      image.src = photo.dataUrl;
      image.alt = "Captured photo " + (index + 1);

      const badge = document.createElement("span");
      badge.className = "photo-select-badge";
      badge.textContent = photo.selected ? "Selected" : "Tap to select";

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "photo-item-remove";
      removeBtn.textContent = "\u00d7";
      removeBtn.setAttribute("aria-label", "Remove photo " + (index + 1));
      removeBtn.addEventListener("click", function(event) {
        event.stopPropagation();
        removePhoto(photo.id);
      });

      const obsInput = document.createElement("textarea");
      obsInput.className = "photo-observation-input";
      obsInput.placeholder = "Observation\u2026";
      obsInput.rows = 2;
      obsInput.value = photo.observation || "";
      obsInput.addEventListener("input", function() {
        const p = capturedPhotos.find(function(x) { return x.id === photo.id; });
        if (p) p.observation = obsInput.value;
      });

      thumb.appendChild(image);
      thumb.appendChild(badge);
      item.appendChild(thumb);
      item.appendChild(removeBtn);
      item.appendChild(obsInput);
      photoStripEl.appendChild(item);
    });

    updateShareSummary();
  }

  function clearPhotos() {
    capturedPhotos = [];
    photoInputEl.value = "";
    renderSharePhotos();
  }

  function updateShareSummaryIfOpen() {
    if (shareOverlayEl.classList.contains("visible")) {
      updateShareSummary();
    }
  }

  function showStationDisplay() {
    stationDisplayEl.style.display = "flex";
  }

  function hideStationDisplay() {
    stationDisplayEl.style.display = "none";
  }

  function resetComputedValues() {
    chainageValueEl.innerHTML = "&mdash;";
    offsetValueEl.innerHTML = "&mdash;";
    offsetDirEl.textContent = "m";
  }

  function resetComputedDisplay() {
    hideStationDisplay();
    resetComputedValues();
  }

  function clearTrackGraphics() {
    if (nearestGraphic) {
      trackingLayer.remove(nearestGraphic);
      nearestGraphic = null;
    }
    if (connectLineGraphic) {
      trackingLayer.remove(connectLineGraphic);
      connectLineGraphic = null;
    }
  }

  function clearStakeoutGraphics() {
    if (targetGraphic) {
      trackingLayer.remove(targetGraphic);
      targetGraphic = null;
    }
    if (stakeoutLineGraphic) {
      trackingLayer.remove(stakeoutLineGraphic);
      stakeoutLineGraphic = null;
    }
  }

  function clearStakeoutTarget(clearInput) {
    stakeoutTarget = null;
    wasArrived = false;
    const distCard = stationDisplayEl.querySelector(".metric-card:last-child");
    if (distCard) distCard.classList.remove("arrived");
    clearStakeoutGraphics();
    if (clearInput) {
      stakeoutInputEl.value = "";
    }
  }

  function findClosestAlignment(userPoint) {
    var closest = null;
    var minDist = Infinity;
    allAlignments.forEach(function(alignment) {
      var result = geometryEngine.nearestCoordinate(alignment.geometry, userPoint);
      if (result && result.distance < minDist) {
        minDist = result.distance;
        closest = alignment;
      }
    });
    return closest;
  }

  function autoSelectClosestAlignment(userPoint) {
    if (autoSelectDone || selectedAlignment || !allAlignments.length) return;
    autoSelectDone = true;
    var alignment = findClosestAlignment(userPoint);
    if (!alignment) return;
    projectSelect.value = alignment.project;
    filteredAlignments = allAlignments.filter(function(a) {
      return a.project === alignment.project;
    });
    populateAlignmentOptions();
    renderFilteredAlignments();
    selectAlignment(alignment);
    setStatus("Auto-selected: " + alignment.name + " (" + t("nearestLocation") + ")");
    var targets = userGraphic ? [userGraphic, alignment.graphic] : [alignment.graphic];
    view.goTo(targets, { animate: true, duration: 800 }).catch(function() {});
  }

  function collapseHud() {
    document.getElementById("hudInner").classList.remove("expanded");
  }

  function expandHud() {
    document.getElementById("hudInner").classList.add("expanded");
  }

  window.toggleHud = function() {
    document.getElementById("hudInner").classList.toggle("expanded");
  };

  function setMetricMode(mode) {
    primaryMetricLabelEl.textContent = mode === "track" ? t("chainage") : t("targetKm");
    secondaryMetricLabelEl.textContent = mode === "track" ? t("offset") : t("distance");
  }

  function clearSelection(statusKey) {
    selectedAlignment = null;
    alignmentNameEl.textContent = t("noAlignment");
    alignmentSelect.value = "";
    clearStakeoutTarget(true);
    resetComputedDisplay();
    clearTrackGraphics();
    filteredAlignments.forEach(function(alignment) {
      alignment.graphic.symbol = alignmentSym;
    });
    expandHud();
    document.getElementById("shareRow").style.display = "none";
    closeShareModal();
    clearPhotos();
    if (statusKey) {
      setStatusKey(statusKey);
    }
  }

  function computeCumDists(polyline) {
    const path = polyline.paths[0];
    const dists = [0];
    for (let i = 1; i < path.length; i += 1) {
      const seg = new Polyline({
        paths: [[path[i - 1].slice(0, 2), path[i].slice(0, 2)]],
        spatialReference: polyline.spatialReference
      });
      dists.push(dists[i - 1] + geometryEngine.geodesicLength(seg, "meters"));
    }
    return dists;
  }

  function mergePaths(geometry) {
    const mergedPath = [];
    geometry.paths.forEach(function(path) {
      path.forEach(function(vertex) {
        const prev = mergedPath[mergedPath.length - 1];
        const isDuplicate = prev && prev[0] === vertex[0] && prev[1] === vertex[1];
        if (!isDuplicate) {
          mergedPath.push(vertex);
        }
      });
    });

    return new Polyline({
      paths: [mergedPath],
      spatialReference: geometry.spatialReference
    });
  }

  function createAlignmentModel(feature, index) {
    if (!feature.geometry || !feature.geometry.paths || !feature.geometry.paths.length) {
      return null;
    }

    const geometry = mergePaths(feature.geometry);
    if (!geometry.paths[0] || geometry.paths[0].length < 2) {
      return null;
    }

    const attributes = feature.attributes || {};
    const cumDists = computeCumDists(geometry);
    const model = {
      id: attributes.FID,
      name: normalizeAlignmentName(attributes.Nume_Ax, index + 1),
      project: normalizeProjectName(attributes.Proiect),
      startMeter: Number(attributes.Start_Meter || 0),
      geometry: geometry,
      cumDists: cumDists
    };

    model.graphic = new Graphic({
      geometry: geometry,
      symbol: alignmentSym,
      attributes: {
        _alignmentId: model.id
      }
    });

    return model;
  }

  async function queryAllFeatures(layer) {
    const objectIdField = layer.objectIdField || "FID";
    const pageSize = layer.maxRecordCount || 2000;
    const totalQuery = layer.createQuery();
    totalQuery.where = "1=1";

    const total = await layer.queryFeatureCount(totalQuery);
    const features = [];

    for (let offset = 0; offset < total; offset += pageSize) {
      const query = layer.createQuery();
      query.where = "1=1";
      query.outFields = ["FID", "Proiect", "Nume_Ax", "Start_Meter"];
      query.returnGeometry = true;
      query.outSpatialReference = view.spatialReference;
      query.orderByFields = [objectIdField + " ASC"];
      query.start = offset;
      query.num = pageSize;

      const result = await layer.queryFeatures(query);
      features.push.apply(features, result.features);
    }

    return features;
  }

  function zoomToAlignments(alignments) {
    const targets = alignments.map(function(alignment) {
      return alignment.graphic;
    });

    if (!targets.length) {
      return;
    }

    view.goTo(targets, { animate: true, duration: 500 }).catch(function() {
      return null;
    });
  }

  function applyAlignmentSymbols() {
    filteredAlignments.forEach(function(alignment) {
      alignment.graphic.symbol = selectedAlignment && selectedAlignment.id === alignment.id ? selectedSym : alignmentSym;
    });
  }

  function renderFilteredAlignments() {
    alignmentLayer.removeAll();
    filteredAlignments.forEach(function(alignment) {
      alignmentLayer.add(alignment.graphic);
    });
    applyAlignmentSymbols();
  }

  function populateProjectOptions() {
    const projectNames = Array.from(new Set(allAlignments.map(function(alignment) {
      return alignment.project;
    }))).sort(function(a, b) {
      return a.localeCompare(b);
    });

    projectSelect.innerHTML = '<option value="">' + t("selectProject") + '</option>';
    projectNames.forEach(function(projectName) {
      const option = document.createElement("option");
      option.value = projectName;
      option.textContent = projectName;
      projectSelect.appendChild(option);
    });
  }

  function populateAlignmentOptions() {
    alignmentSelect.innerHTML = "";

    if (!projectSelect.value) {
      alignmentSelect.disabled = true;
      alignmentSelect.innerHTML = '<option value="">' + t("selectProjectFirst") + '</option>';
      return;
    }

    alignmentSelect.disabled = false;
    alignmentSelect.innerHTML = '<option value="">' + t("selectAlignment") + '</option>';

    filteredAlignments
      .slice()
      .sort(function(a, b) {
        return a.name.localeCompare(b.name);
      })
      .forEach(function(alignment) {
        const option = document.createElement("option");
        option.value = String(alignment.id);
        option.textContent = alignment.name;
        alignmentSelect.appendChild(option);
      });
  }

  function applyProjectFilter(projectName) {
    filteredAlignments = projectName
      ? allAlignments.filter(function(alignment) {
          return alignment.project === projectName;
        })
      : allAlignments.slice();

    if (!selectedAlignment || !filteredAlignments.some(function(alignment) { return alignment.id === selectedAlignment.id; })) {
      clearSelection(projectName ? "selectAnAlignment" : "selectAProject");
    }

    populateAlignmentOptions();
    renderFilteredAlignments();
    zoomToAlignments(filteredAlignments);

    if (!projectName) {
      return;
    }

    if (selectedAlignment) {
      alignmentSelect.value = String(selectedAlignment.id);
      setStatus("Selected " + selectedAlignment.name + " in " + selectedAlignment.project + ".");
      return;
    }

    if (filteredAlignments.length === 1) {
      selectAlignment(filteredAlignments[0]);
      return;
    }

    setStatus(filteredAlignments.length + " alignments available in " + projectName + ".");
  }

  function selectAlignment(alignment) {
    const previousAlignmentId = selectedAlignment ? selectedAlignment.id : null;
    selectedAlignment = alignment;
    alignmentNameEl.textContent = alignment.name;
    showStationDisplay();
    alignmentSelect.value = String(alignment.id);
    renderFilteredAlignments();
    applyAlignmentSymbols();
    clearTrackGraphics();
    if (previousAlignmentId !== alignment.id) {
      clearStakeoutTarget(true);
      smoothedPoint = null;
      clearPhotos();
      closeShareModal();
    }
    collapseHud();
    document.getElementById("shareRow").style.display = "";
    updateShareSummary();
    if (activeMode === "stakeout") {
      refreshModeDisplay();
      return;
    }
    setStatus("Selected " + alignment.name + " in " + alignment.project + ".");
    if (userGraphic) {
      updateTrackMetrics(userGraphic.geometry);
    } else {
      resetComputedValues();
    }
  }

  function findAlignmentById(id) {
    return filteredAlignments.find(function(alignment) {
      return String(alignment.id) === String(id);
    }) || null;
  }

  function determineSide(line, segIdx, pt) {
    const path = line.paths[0];
    const i = Math.min(Math.max(segIdx, 0), path.length - 2);
    const a = path[i];
    const b = path[i + 1];
    return ((b[0] - a[0]) * (pt.y - a[1]) - (b[1] - a[1]) * (pt.x - a[0])) > 0 ? "left" : "right";
  }

  function findPerpendicularProjection(line, userPoint) {
    const path = line.paths[0];
    let bestMatch = null;

    for (let i = 0; i < path.length - 1; i += 1) {
      const a = path[i];
      const b = path[i + 1];
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const segLenSq = (dx * dx) + (dy * dy);

      if (segLenSq === 0) {
        continue;
      }

      const px = userPoint.x - a[0];
      const py = userPoint.y - a[1];
      const t = ((px * dx) + (py * dy)) / segLenSq;

      if (t <= 0 || t >= 1) {
        continue;
      }

      const projX = a[0] + (t * dx);
      const projY = a[1] + (t * dy);
      const projectedPoint = new Point({
        x: projX,
        y: projY,
        spatialReference: line.spatialReference
      });
      const offsetLine = new Polyline({
        paths: [[[userPoint.x, userPoint.y], [projX, projY]]],
        spatialReference: line.spatialReference
      });
      const offsetM = geometryEngine.geodesicLength(offsetLine, "meters");

      if (!bestMatch || offsetM < bestMatch.offsetM) {
        bestMatch = {
          coordinate: projectedPoint,
          segIdx: i,
          t: t,
          offsetM: offsetM
        };
      }
    }

    return bestMatch;
  }

  function distanceAlongFromProjection(alignment, projResult) {
    const line = alignment.geometry;
    const path = line.paths[0];
    const segIdx = Math.min(Math.max(projResult.segIdx, 0), path.length - 2);
    const startVertex = path[segIdx];
    const nearPt = projResult.coordinate;
    const partialSeg = new Polyline({
      paths: [[startVertex.slice(0, 2), [nearPt.x, nearPt.y]]],
      spatialReference: line.spatialReference
    });
    const partialDist = geometryEngine.geodesicLength(partialSeg, "meters");
    return alignment.cumDists[segIdx] + partialDist;
  }

  function parseChainageInput(value) {
    const normalized = String(value || "").trim();
    if (!normalized || normalized.indexOf(".") !== -1) {
      return null;
    }

    if (/^[+-]?\d+$/.test(normalized)) {
      const totalMeters = Number(normalized);
      return Number.isFinite(totalMeters) ? totalMeters : null;
    }

    const match = normalized.match(/^([+-]?)(\d+)\s*\+\s*(\d{1,3})$/);
    if (match) {
      const sign = match[1] === "-" ? -1 : 1;
      const km = Number(match[2]);
      const meters = Number(match[3]);
      if (!Number.isFinite(km) || !Number.isFinite(meters) || meters >= 1000) {
        return null;
      }

      return sign * ((km * 1000) + meters);
    }

    return null;
  }

  function resolvePointAtDistance(alignment, rawDistance) {
    const path = alignment.geometry.paths[0];
    const cumDists = alignment.cumDists;
    const totalLength = cumDists[cumDists.length - 1];

    if (rawDistance < 0 || rawDistance > totalLength) {
      return null;
    }

    if (rawDistance === 0) {
      return {
        coordinate: new Point({
          x: path[0][0],
          y: path[0][1],
          spatialReference: alignment.geometry.spatialReference
        }),
        segIdx: 0
      };
    }

    for (let i = 1; i < cumDists.length; i += 1) {
      if (rawDistance > cumDists[i]) {
        continue;
      }

      const segIdx = i - 1;
      const segStart = cumDists[segIdx];
      const segLength = cumDists[i] - segStart;
      const ratio = segLength === 0 ? 0 : (rawDistance - segStart) / segLength;
      const startVertex = path[segIdx];
      const endVertex = path[i];

      return {
        coordinate: new Point({
          x: startVertex[0] + ((endVertex[0] - startVertex[0]) * ratio),
          y: startVertex[1] + ((endVertex[1] - startVertex[1]) * ratio),
          spatialReference: alignment.geometry.spatialReference
        }),
        segIdx: Math.min(segIdx, path.length - 2)
      };
    }

    return {
      coordinate: new Point({
        x: path[path.length - 1][0],
        y: path[path.length - 1][1],
        spatialReference: alignment.geometry.spatialReference
      }),
      segIdx: Math.max(path.length - 2, 0)
    };
  }

  function ensureTargetGraphic(point) {
    if (!targetGraphic) {
      targetGraphic = new Graphic({ geometry: point, symbol: targetSym });
      trackingLayer.add(targetGraphic);
    } else {
      targetGraphic.geometry = point;
    }
  }

  function updateTrackMetrics(userPoint) {
    if (!selectedAlignment) {
      setStatusKey("selectAlignmentFirst");
      return;
    }

    const line = selectedAlignment.geometry;
    const result = findPerpendicularProjection(line, userPoint);
    if (!result || !result.coordinate) {
      showStationDisplay();
      resetComputedValues();
      clearTrackGraphics();
      setStatusKey("alignmentOutOfBounds");
      return;
    }

    const nearPt = result.coordinate;
    const segIdx = Math.min(result.segIdx, line.paths[0].length - 2);
    const distanceAlong = distanceAlongFromProjection(selectedAlignment, result);
    const adjustedChainage = distanceAlong + selectedAlignment.startMeter;

    const offsetLine = new Polyline({
      paths: [[[userPoint.x, userPoint.y], [nearPt.x, nearPt.y]]],
      spatialReference: line.spatialReference
    });
    const offsetM = result.offsetM;
    const side = determineSide(line, segIdx, userPoint);

    const precision = lastAccuracy <= 3 ? 1 : 0;
    showStationDisplay();
    chainageValueEl.textContent = formatChainage(adjustedChainage, precision);
    offsetValueEl.textContent = offsetM.toFixed(1);
    offsetDirEl.innerHTML = 'm <span class="offset-direction ' + side + '">' + side.toUpperCase() + "</span>";
    setStatus("KM " + formatChainage(adjustedChainage, precision) + " | " + offsetM.toFixed(1) + " m " + side);
    updateShareSummaryIfOpen();

    if (!nearestGraphic) {
      nearestGraphic = new Graphic({ geometry: nearPt, symbol: nearestSym });
      trackingLayer.add(nearestGraphic);
    } else {
      nearestGraphic.geometry = nearPt;
    }

    if (!connectLineGraphic) {
      connectLineGraphic = new Graphic({ geometry: offsetLine, symbol: connectSym });
      trackingLayer.add(connectLineGraphic);
    } else {
      connectLineGraphic.geometry = offsetLine;
    }
  }

  function updateStakeoutGuidance(userPoint) {
    showStationDisplay();

    if (!selectedAlignment) {
      setStatusKey("selectAlignmentFirst");
      return;
    }

    if (!stakeoutTarget) {
      resetComputedValues();
      clearStakeoutGraphics();
      setStatusKey("enterTargetChainage");
      return;
    }

    const targetPoint = stakeoutTarget.coordinate;
    const guidanceLine = new Polyline({
      paths: [[[userPoint.x, userPoint.y], [targetPoint.x, targetPoint.y]]],
      spatialReference: selectedAlignment.geometry.spatialReference
    });
    const distanceToTarget = geometryEngine.geodesicLength(guidanceLine, "meters");
    const bearing = bearingToTarget(userPoint, targetPoint);

    const arrived = distanceToTarget < 2.0;
    if (arrived && !wasArrived && navigator.vibrate) {
      navigator.vibrate([100, 60, 100, 60, 300]);
    }
    wasArrived = arrived;
    const distCard = stationDisplayEl.querySelector(".metric-card:last-child");
    if (distCard) distCard.classList.toggle("arrived", arrived);

    ensureTargetGraphic(targetPoint);
    if (!stakeoutLineGraphic) {
      stakeoutLineGraphic = new Graphic({ geometry: guidanceLine, symbol: stakeoutLineSym });
      trackingLayer.add(stakeoutLineGraphic);
    } else {
      stakeoutLineGraphic.geometry = guidanceLine;
    }

    chainageValueEl.textContent = formatChainage(stakeoutTarget.displayMeters);
    offsetValueEl.textContent = distanceToTarget.toFixed(1);
    offsetDirEl.textContent = bearing;
    setStatus("Target " + formatChainage(stakeoutTarget.displayMeters) + " | " + distanceToTarget.toFixed(1) + " m | " + bearing);
    updateShareSummaryIfOpen();
  }

  function refreshModeDisplay() {
    setMetricMode(activeMode);
    btnTrackModeEl.classList.toggle("active", activeMode === "track");
    btnStakeoutModeEl.classList.toggle("active", activeMode === "stakeout");
    stakeoutRowEl.classList.toggle("hidden", activeMode !== "stakeout");

    if (!selectedAlignment) {
      resetComputedDisplay();
      updateShareSummaryIfOpen();
      return;
    }

    showStationDisplay();
    if (activeMode === "track") {
      clearStakeoutGraphics();
      if (userGraphic) {
        updateTrackMetrics(userGraphic.geometry);
      } else {
        resetComputedValues();
        setStatusKey("trackModeReady");
        updateShareSummaryIfOpen();
      }
      return;
    }

    clearTrackGraphics();
    if (stakeoutTarget) {
      chainageValueEl.textContent = formatChainage(stakeoutTarget.displayMeters);
      if (userGraphic) {
        updateStakeoutGuidance(userGraphic.geometry);
      } else {
        ensureTargetGraphic(stakeoutTarget.coordinate);
        offsetValueEl.innerHTML = "&mdash;";
        offsetDirEl.textContent = "m";
        setStatusKey("stakeoutTargetSet");
        updateShareSummaryIfOpen();
      }
      return;
    }

    resetComputedValues();
    setStatusKey("enterTargetChainage");
    updateShareSummaryIfOpen();
  }

  function updateFromUserPoint(userPoint) {
    if (activeMode === "stakeout") {
      updateStakeoutGuidance(userPoint);
    } else {
      updateTrackMetrics(userPoint);
    }
  }

  window.setAppMode = function(mode) {
    activeMode = mode === "stakeout" ? "stakeout" : "track";
    refreshModeDisplay();
  };

  window.applyStakeoutTarget = function() {
    if (!selectedAlignment) {
      setStatusKey("selectAlignmentFirst");
      return;
    }

    const displayMeters = parseChainageInput(stakeoutInputEl.value);
    if (displayMeters === null) {
      clearStakeoutTarget(false);
      showStationDisplay();
      resetComputedValues();
      setStatusKey("invalidChainage");
      updateShareSummaryIfOpen();
      return;
    }

    const rawDistance = displayMeters - selectedAlignment.startMeter;
    const totalLength = selectedAlignment.cumDists[selectedAlignment.cumDists.length - 1];
    if (rawDistance < 0 || rawDistance > totalLength) {
      clearStakeoutTarget(false);
      showStationDisplay();
      resetComputedValues();
      setStatusKey("chainageOutsideAlignment");
      updateShareSummaryIfOpen();
      return;
    }

    const resolvedPoint = resolvePointAtDistance(selectedAlignment, rawDistance);
    if (!resolvedPoint) {
      clearStakeoutTarget(false);
      showStationDisplay();
      resetComputedValues();
      setStatusKey("unableToResolve");
      updateShareSummaryIfOpen();
      return;
    }

    stakeoutTarget = {
      displayMeters: displayMeters,
      rawDistance: rawDistance,
      coordinate: resolvedPoint.coordinate,
      segIdx: resolvedPoint.segIdx
    };

    showStationDisplay();
    ensureTargetGraphic(stakeoutTarget.coordinate);
    chainageValueEl.textContent = formatChainage(stakeoutTarget.displayMeters);
    offsetValueEl.innerHTML = "&mdash;";
    offsetDirEl.textContent = "m";

    if (userGraphic) {
      updateStakeoutGuidance(userGraphic.geometry);
    } else {
      setStatusKey("stakeoutTargetSet");
      updateShareSummaryIfOpen();
    }
  };

  async function loadPublicLayer() {
    setStatusKey("loadingAlignments");

    try {
      const layer = new FeatureLayer({ url: PUBLIC_LAYER_URL });
      await layer.load();
      const features = await queryAllFeatures(layer);

      allAlignments = features.map(function(feature, index) {
        return createAlignmentModel(feature, index);
      }).filter(Boolean);

      log("Layer loaded: " + layer.title);
      log("Alignments loaded: " + allAlignments.length);

      populateProjectOptions();
      filteredAlignments = allAlignments.slice();
      renderFilteredAlignments();
      zoomToAlignments(filteredAlignments);
      if (lastRawMapPt) {
        autoSelectClosestAlignment(lastRawMapPt);
      } else {
        setStatusKey("chooseProject");
      }
    } catch (err) {
      log("ERROR: " + err.message);
      setStatusKey("failedToLoad");
      projectSelect.innerHTML = '<option value="">' + t("loadFailed") + '</option>';
      alignmentSelect.innerHTML = '<option value="">' + t("unavailable") + '</option>';
      alignmentSelect.disabled = true;
    }
  }

  function startGps() {
    if (gpsWatchId !== null) return;

    if (!navigator.geolocation) {
      gpsIndicatorEl.className = "gps-indicator error";
      return;
    }

    gpsIndicatorEl.className = "gps-indicator";

    gpsWatchId = navigator.geolocation.watchPosition(
      function(pos) {
        const pt = new Point({
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
          spatialReference: { wkid: 4326 }
        });
        const mapPt = projectionReady ? projection.project(pt, view.spatialReference) : pt;

        updateAccuracyDisplay(pos.coords.accuracy);
        lastRawMapPt = mapPt;
        lastWGS84 = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        document.getElementById("btnRecenter").style.display = "";

        const accuracyCircle = geometryEngine.geodesicBuffer(mapPt, pos.coords.accuracy, "meters");
        if (!accuracyGraphic) {
          accuracyGraphic = new Graphic({ geometry: accuracyCircle, symbol: accuracySym });
          trackingLayer.add(accuracyGraphic);
        } else {
          accuracyGraphic.geometry = accuracyCircle;
        }

        if (!smoothedPoint) {
          smoothedPoint = mapPt;
        } else {
          smoothedPoint = new Point({
            x: GPS_ALPHA * mapPt.x + (1 - GPS_ALPHA) * smoothedPoint.x,
            y: GPS_ALPHA * mapPt.y + (1 - GPS_ALPHA) * smoothedPoint.y,
            spatialReference: mapPt.spatialReference
          });
        }

        const heading = pos.coords.heading;
        const speed = pos.coords.speed;
        const hasHeading = Number.isFinite(heading) && Number.isFinite(speed) && speed > 0.5;
        if (hasHeading) lastHeading = heading;

        const activeSym = hasHeading
          ? new SimpleMarkerSymbol({
              color: [74, 222, 128, 1],
              size: 18,
              style: "triangle",
              angle: -heading,
              outline: { color: [255, 255, 255, 0.9], width: 2 }
            })
          : userSym;

        if (!userGraphic) {
          userGraphic = new Graphic({ geometry: mapPt, symbol: activeSym });
          trackingLayer.add(userGraphic);
        } else {
          userGraphic.geometry = mapPt;
          userGraphic.symbol = activeSym;
        }

        autoSelectClosestAlignment(mapPt);
        updateFromUserPoint(smoothedPoint);
      },
      function(err) {
        gpsIndicatorEl.className = "gps-indicator error";
        setStatus("GPS: " + err.message);
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );
  };

  function openShareModal() {
    if (!selectedAlignment) {
      setStatusKey("selectAlignmentFirst");
      return;
    }

    updateShareSummary();
    renderSharePhotos();
    shareOverlayEl.classList.add("visible");
    shareOverlayEl.setAttribute("aria-hidden", "false");
  }

  function closeShareModal() {
    shareOverlayEl.classList.remove("visible");
    shareOverlayEl.setAttribute("aria-hidden", "true");
  }

  function triggerCameraCapture() {
    if (!selectedAlignment) {
      setStatusKey("selectAlignmentFirst");
      return;
    }

    photoInputEl.click();
  }

  function togglePhotoSelection(id) {
    capturedPhotos = capturedPhotos.map(function(photo) {
      if (photo.id !== id) {
        return photo;
      }

      return {
        id: photo.id,
        file: photo.file,
        dataUrl: photo.dataUrl,
        selected: !photo.selected
      };
    });
    renderSharePhotos();
  }

  function removePhoto(id) {
    capturedPhotos = capturedPhotos.filter(function(photo) {
      return photo.id !== id;
    });
    renderSharePhotos();
  }

  window.openShareModal = openShareModal;
  window.closeShareModal = closeShareModal;
  window.triggerCameraCapture = triggerCameraCapture;
  window.togglePhotoSelection = togglePhotoSelection;
  window.removePhoto = removePhoto;
  window.clearPhotos = clearPhotos;

  photoInputEl.addEventListener("change", function(event) {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const reader = new FileReader();
    const id = ++photoIdCounter;
    reader.onload = function(loadEvent) {
      capturedPhotos.push({
        id: id,
        file: file,
        dataUrl: loadEvent.target.result,
        selected: true,
        observation: ""
      });
      renderSharePhotos();
    };
    reader.readAsDataURL(file);
  });

  shareOverlayEl.addEventListener("click", function(event) {
    if (event.target === shareOverlayEl) {
      closeShareModal();
    }
  });

  window.sharePosition = async function() {
    const selectedPhotos = getSelectedPhotos();

    if (!selectedPhotos.length) {
      updateShareSummary();
      return;
    }

    const payload = buildSharePayload();
    const overlayText = payload.text.split("\n").filter(function(l) {
      return !l.startsWith("Maps:");
    }).join("\n");

    const stampedFiles = await Promise.all(
      selectedPhotos.map(function(photo) {
        const photoOverlayText = (photo.observation && photo.observation.trim())
          ? overlayText + "\nObservation: " + photo.observation.trim()
          : overlayText;
        return addTextOverlayToPhoto(photo.file, photoOverlayText);
      })
    );

    const obsLines = selectedPhotos
      .filter(function(p) { return p.observation && p.observation.trim(); })
      .map(function(p, i) {
        return selectedPhotos.length > 1
          ? "Photo " + (i + 1) + " Observation: " + p.observation.trim()
          : "Observation: " + p.observation.trim();
      });
    const shareText = obsLines.length
      ? payload.text + "\n" + obsLines.join("\n")
      : payload.text;

    if (navigator.share) {
      if (canShareFiles(stampedFiles)) {
        try {
          await navigator.share({
            text: shareText,
            files: stampedFiles
          });
          return;
        } catch (err) {
          if (err && err.name === "AbortError") {
            return;
          }
        }
      }

      try {
        await navigator.share({ text: shareText });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") {
          return;
        }
      }
    }

    window.open("https://wa.me/?text=" + encodeURIComponent(shareText), "_blank");
  };

  window.toggleBasemap = function() {
    applyBasemapMode(currentBasemapMode === "map" ? "satellite" : "map");
  };

  window.recenterMap = function() {
    if (!lastRawMapPt) return;
    view.goTo({ target: lastRawMapPt, zoom: Math.max(view.zoom, 15) }, { animate: true, duration: 500 }).catch(function() {
      return null;
    });
  };

  // --- Symbols ---
  const accuracySym = new SimpleFillSymbol({
    color: [74, 222, 128, 0.08],
    outline: { color: [74, 222, 128, 0.35], width: 1 }
  });
  const alignmentSym = new SimpleLineSymbol({ color: [255, 237, 0, 0.6], width: 3 });
  const selectedSym = new SimpleLineSymbol({ color: [255, 255, 255, 1], width: 5 });
  const userSym = new SimpleMarkerSymbol({
    color: [74, 222, 128, 1],
    size: 14,
    outline: { color: [255, 255, 255, 0.9], width: 2 }
  });
  const nearestSym = new SimpleMarkerSymbol({
    color: [255, 237, 0, 1],
    size: 10,
    style: "diamond",
    outline: { color: [10, 25, 41, 0.8], width: 1.5 }
  });
  const connectSym = new SimpleLineSymbol({ color: [220, 220, 220, 0.55], width: 1.5, style: "dash" });
  const targetSym = new SimpleMarkerSymbol({
    color: [56, 189, 248, 1],
    size: 14,
    style: "x",
    outline: { color: [255, 255, 255, 0.9], width: 2 }
  });
  const stakeoutLineSym = new SimpleLineSymbol({ color: [56, 189, 248, 0.75], width: 2.5 });

  // --- Layers & Map ---
  const alignmentLayer = new GraphicsLayer();
  const trackingLayer = new GraphicsLayer();

  const map = new Map({
    basemap: basemapModes[currentBasemapMode],
    layers: [alignmentLayer, trackingLayer]
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [26.0, 44.5],
    zoom: 7,
    ui: { components: ["zoom"] },
    constraints: { rotationEnabled: true }
  });

  view.ui.move("zoom", "bottom-right");

  projection.load()
    .then(function() {
      projectionReady = true;
      log("Projection ready");
    })
    .catch(function(err) {
      log("Projection load failed: " + err.message);
    });

  function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    langSelectEl.value = lang;
    localStorage.setItem("alignmentTrackerLang", lang);

    btnRecenterEl.textContent = t("center");
    btnTrackModeEl.textContent = t("track");
    btnStakeoutModeEl.textContent = t("stakeout");
    btnShareEl.textContent = t("shareBtn");
    document.getElementById("labelProject").textContent = t("project");
    document.getElementById("labelAlignment").textContent = t("alignment");
    stakeoutInputEl.placeholder = t("stakeoutPlaceholder");
    document.getElementById("btnSetTarget").textContent = t("setTarget");

    document.getElementById("shareEyebrow").textContent = t("shareEyebrow");
    document.getElementById("shareTitle").textContent = t("shareTitle");
    document.getElementById("btnCloseShare").textContent = t("close");
    document.getElementById("shareCurrentDataLabel").textContent = t("currentData");
    document.getElementById("shareProjectKey").textContent = t("project");
    document.getElementById("shareAlignmentKey").textContent = t("alignment");
    document.getElementById("shareCoordsKey").textContent = t("coordsLabel");
    document.getElementById("shareCapturedPhotosLabel").textContent = t("capturedPhotos");
    document.getElementById("btnTakePhotoShare").textContent = t("takePhoto");
    btnShareSelectedEl.textContent = t("shareSelected");
    photoEmptyStateEl.innerHTML = t("photoEmptyState");

    if (!selectedAlignment) alignmentNameEl.textContent = t("noAlignment");

    if (projectSelect.options.length && projectSelect.options[0].value === "") {
      projectSelect.options[0].text = t("selectProject");
    }
    if (alignmentSelect.options.length && alignmentSelect.options[0].value === "") {
      alignmentSelect.options[0].text = projectSelect.value ? t("selectAlignment") : t("selectProjectFirst");
    }

    applyBasemapMode(currentBasemapMode);
    setMetricMode(activeMode);
    if (_statusKey) setStatusKey(_statusKey);
    updateShareSummaryIfOpen();
  }

  window.setLanguage = setLanguage;

  applyBasemapMode(currentBasemapMode);
  setMetricMode(activeMode);
  updateShareSummary();

  const savedLang = localStorage.getItem("alignmentTrackerLang") || "en";
  setLanguage(savedLang);

  // --- Event Listeners ---
  langSelectEl.addEventListener("change", function(event) {
    setLanguage(event.target.value);
  });

  projectSelect.addEventListener("change", function(event) {
    applyProjectFilter(event.target.value);
  });

  alignmentSelect.addEventListener("change", function(event) {
    const alignment = findAlignmentById(event.target.value);
    if (!alignment) {
      clearSelection("selectAnAlignment");
      return;
    }
    selectAlignment(alignment);
  });

  stakeoutInputEl.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      applyStakeoutTarget();
    }
  });

  view.on("click", function(event) {
    // In stakeout mode with an alignment selected, click on map to project & set target
    if (activeMode === "stakeout" && selectedAlignment) {
      const clickPt = event.mapPoint;
      const proj = findPerpendicularProjection(selectedAlignment.geometry, clickPt);
      if (proj) {
        const distAlong = distanceAlongFromProjection(selectedAlignment, proj);
        const displayMeters = distAlong + selectedAlignment.startMeter;
        stakeoutInputEl.value = formatChainage(displayMeters);
        applyStakeoutTarget();
      } else {
        setStatusKey("clickCloser");
      }
      return;
    }

    if (!projectSelect.value) {
      setStatusKey("chooseProjectFirst");
      return;
    }

    view.hitTest(event).then(function(result) {
      const hit = result.results.find(function(entry) {
        return entry.graphic && entry.graphic.layer === alignmentLayer;
      });

      if (!hit) {
        return;
      }

      const alignment = findAlignmentById(hit.graphic.attributes._alignmentId);
      if (alignment) {
        selectAlignment(alignment);
      }
    });
  });

  view.on("double-click", function(event) {
    event.stopPropagation();

    if (!selectedAlignment) {
      setStatusKey("selectAlignmentSimulate");
      return;
    }

    const pt = event.mapPoint;
    if (!userGraphic) {
      userGraphic = new Graphic({ geometry: pt, symbol: userSym });
      trackingLayer.add(userGraphic);
    } else {
      userGraphic.geometry = pt;
    }
    updateFromUserPoint(pt);
  });

  async function requestWakeLock() {
    if (!navigator.wakeLock) return;
    try { wakeLock = await navigator.wakeLock.request("screen"); } catch (_) {}
  }

  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "visible") requestWakeLock();
  });

  view.when(function() {
    loadPublicLayer();
    startGps();
    requestWakeLock();
  });
});
