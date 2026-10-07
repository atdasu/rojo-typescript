local core = require("../out/shared/InternalLibraries/core")

assert(core.createGreeting("Test") == "Hello from Test!", "Greeting names the project")

print("PASS: core")
