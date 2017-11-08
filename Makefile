.DEFAULT_GOAL := help
.PHONY := help init clean

SHELL=/bin/bash
VENV ?= .env
VENV_PYTHON ?= python3


help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

$(VENV):
	$(VENV_PYTHON) -m venv $(VENV)
	$(VENV)/bin/pip install -r requirements.txt

init: $(VENV) ## Bootstrap local environment

clean:  ## Removes collected dependencies
	rm -rf $(VENV)
