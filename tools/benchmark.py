#!/usr/bin/env python
# Does benchark and store data.

import os
import json
import time
from util import run, run_output, root_path

benchmark_types = [
    "hello",
    "relative_import"
]
benchmark_cmds = [
    "out/release/deno tests/002_hello.ts",
    "out/release/deno tests/003_relative_import.ts"
]

data_file = "gh-pages/data.json"
benchmark_file = "benchmark.json"

def read_json(filename):
    with open(filename) as json_file:
        return json.load(json_file)

def write_json(filename, data):
    with open(filename, 'w') as outfile:
        json.dump(data, outfile)

def prepare_gh_pages_dir():
    if os.path.exists("gh-pages"):
        return
    try:
        run(["git", "clone", "--depth", "1", "-b", "gh-pages", "https://github.com/kt3k/deno.git", "gh-pages"])
    except:
        os.mkdir("gh-pages")
        with open("gh-pages/data.json", "w") as f:
            f.write("[]") # writes empty json data

os.chdir(root_path)
prepare_gh_pages_dir()
run(["hyperfine", "--export-json", benchmark_file, "--warmup", "3"] + benchmark_cmds)
all_data = read_json(data_file)
benchmark_data = read_json(benchmark_file)
sha1 = run_output(["git", "rev-parse", "HEAD"]).strip()
new_data = {
    "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
    "sha1": sha1,
    "benchmark": {}
}
for type, data in zip(benchmark_types, benchmark_data["results"]):
    new_data["benchmark"][type] = {
        "mean": data["mean"],
        "stddev": data["stddev"],
        "user": data["user"],
        "system": data["system"],
        "min": data["min"],
        "max": data["max"]
    }
all_data.append(new_data)
write_json(data_file, all_data)
