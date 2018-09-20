import * as deno from "deno";

const DATA_FILE = "gh-pages/data.json";
const BENCHMARK_FILE = "benchmark.json";
const SHA1_TEXT = "sha1.txt";

const benchmarkTypes = ["hello", "relative_import"];

const decoder = new TextDecoder();
const encoder = new TextEncoder();

const readText = file => decoder.decode(deno.readFileSync(file));
const readJson = file => JSON.parse(readText(file));
const writeJson = (file, data) =>
  deno.writeFileSync(file, encoder.encode(JSON.stringify(data)));

const benchmarkData = readJson(BENCHMARK_FILE);
const allData = readJson(DATA_FILE);
const sha1 = readText(SHA1_TEXT).trim();

const newData = {
  created_at: new Date(),
  sha1,
  benchmark: {}
};

benchmarkTypes.forEach((type, i) => {
  const benchmark = benchmarkData.results[i];
  newData.benchmark[type] = {
    mean: benchmark.mean,
    stddev: benchmark.stddev,
    user: benchmark.user,
    system: benchmark.system,
    min: benchmark.min,
    max: benchmark.max
  };
});

allData.push(newData);

writeJson(DATA_FILE, allData);
