import React from 'react';

const ResearchSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Our Research Areas
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Exploring the frontiers of computational biology to solve critical challenges in modern medicine and biology.
          </p>
        </div>

        <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
          {/* Research Card 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-teal-800 mb-3">Genomics</h3>
            <p className="text-gray-600">
              Developing algorithms for variant calling, genome assembly, and structural variation detection from next-generation sequencing data.
            </p>
          </div>

          {/* Research Card 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-teal-800 mb-3">Structural Biology</h3>
            <p className="text-gray-600">
              Predicting protein structures and modeling protein-ligand interactions to accelerate drug discovery pipelines.
            </p>
          </div>

          {/* Research Card 3 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-teal-800 mb-3">Systems Biology</h3>
            <p className="text-gray-600">
              Integrating multi-omics datasets to construct and analyze complex biological networks and pathways.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
