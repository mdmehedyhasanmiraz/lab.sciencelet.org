# ProtIndex: Physicochemical & Biophysical Sequence Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

An open-source, web-based computational biology platform developed by **Sciencelet Lab** for deterministic physicochemical and biophysical profiling of proteins and peptides.

---

## Features

- **Physicochemical Summary**: Molecular weight, isoelectric point ($pI$), GRAVY index, extinction coefficients ($\epsilon_{280}$), instability index, aliphatic index, Boman index, partial specific volume ($v$), and bound hydration water.
- **Biophysical Plots**:
  - **Net Charge vs. pH Titration Curve**: Henderson-Hasselbalch / Bjellqvist pKa titration model ($\text{pH } 2 \to 12$).
  - **Kyte-Doolittle Hydropathy Profile**: Interactive sliding-window hydropathy line chart ($7, 9, 13, 19, 21$ residues) with transmembrane core threshold markers.
  - **$\alpha$-Helical Wheel Projection**: 2D polar projection ($100^\circ$ per residue) for visual amphipathic segregation analysis.
  - **Biophysical Property Radar**: 10-axis comparative multivariate profile.
- **High-Resolution Vector & Image Exports**: 2x high-resolution PNG (Solid White & Transparent) and SVG export options with integrated white-background legends for publication figures.

---

## Citation

If you use ProtIndex in published academic research, benchmarking, or educational material, please cite the web application:

```bibtex
@misc{protindex2026,
  author = {Miraz, Md Mehedy Hasan and Ferdousy, Tanbin Jahan and Risat, Md Tahsinul Haque},
  title = {ProtIndex: A Web-Based Physicochemical & Biophysical Sequence Analyzer},
  year = {2026},
  publisher = {Sciencelet Lab},
  url = {https://lab.sciencelet.org/protindex}
}
```

**APA Format:**
> Miraz, M. M. H., Ferdousy, T. J., & Risat, M. T. H. (2026). *ProtIndex: A Web-Based Physicochemical & Biophysical Sequence Analyzer*. Sciencelet Lab. https://lab.sciencelet.org/protindex

---

## Open Source Licensing

ProtIndex complies with the open access and code-sharing requirements of open-access journals (including PLOS ONE):

- **Software Source Code**: Licensed under the [MIT License](LICENSE). Anyone who redistributes, forks, or copies the code is legally required to retain the copyright and attribution notices.
- **Documentation & Scientific Content**: Licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
