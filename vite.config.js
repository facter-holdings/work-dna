module.exports = {
  root: "./",
  // GitHub Pages가 /work-dna/ 하위에서 서빙하므로 에셋 주소를 상대 경로로 뽑는다
  base: "./",
  build: {
    outDir: "docs",
    rollupOptions: {
      output: {
        // 직원용 페이지(public/employee)가 이 파일을 직접 참조하므로 이름을 고정한다
        entryFileNames: "assets/app.js",
      },
    },
  },
};
