import { ChangeEvent, Fragment, useMemo, useRef, useState } from "react";
import { Combobox } from "@headlessui/react";
import { faker } from "@faker-js/faker";
import {
  ChevronUpDownIcon as SelectorIcon,
  CheckIcon as CheckMarkIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useVirtualizer } from "@tanstack/react-virtual";

function range(n: number) {
  return Array.from(Array(n).keys());
}

const persons = range(1000).map((i) => ({
  id: `person-${i}`,
  name: faker.name.fullName(),
}));

export function App() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  function onSelectionChange(selectedIds: string[]) {
    setSelectedIds(selectedIds);
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.currentTarget.value);
  }

  function getDisplayLabel(id: unknown) {
    return persons.find((person) => person.id === id)!.name;
  }

  function getRemoveButtonDisplayLabel(id: string) {
    return `Remove ${getDisplayLabel(id)}`;
  }

  const terms = searchTerm.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const filteredPersons =
    terms.length === 0
      ? persons
      : persons.filter((person) => {
          const name = person.name.toLocaleLowerCase();
          return terms.some((term) => name.includes(term));
        });

  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const virtualizer = useVirtualizer({
    count: filteredPersons.length,
    estimateSize() {
      return 40;
    },
    getItemKey(index) {
      return filteredPersons[index]!.name;
    },
    getScrollElement() {
      return element;
    },
    // overscan: 5,
  });

  return (
    <div>
      <div className="mx-auto max-w-xl p-8">
        <Combobox
          multiple
          value={selectedIds}
          onChange={onSelectionChange}
          as="div"
          className="relative"
        >
          <div className="grid gap-y-1">
            <Combobox.Label className="text-xs font-medium text-neutral-600">
              Label
            </Combobox.Label>

            <div className="relative w-full cursor-default text-sm overflow-hidden rounded-lg bg-neutral-0 text-left shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-0/75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-300">
              {selectedIds.length > 0 ? (
                <ul role="list" className="flex flex-wrap gap-2 p-2 text-xs">
                  {selectedIds.map((id) => {
                    function onRemove() {
                      setSelectedIds((ids) => ids.filter((i) => i !== id));
                    }

                    return (
                      <li
                        key={id}
                        className="inline-flex items-center gap-1 rounded bg-primary-200 px-2 py-1 font-medium"
                      >
                        <span className="truncate block">
                          {getDisplayLabel(id)}
                        </span>
                        <button onClick={onRemove}>
                          <span className="sr-only">
                            {getRemoveButtonDisplayLabel(id)}
                          </span>
                          <XMarkIcon aria-hidden className="w-3 h-3" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              <div className="relative">
                <Combobox.Input
                  onChange={onInputChange}
                  autoComplete="off"
                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-neutral-900 focus-visible:outline-none"
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-400">
                  <SelectorIcon aria-hidden className="w-5 h-5" />
                </Combobox.Button>
              </div>
            </div>
          </div>

          <Combobox.Options className="overflow-y-auto absolute z-overlay mt-1 w-full rounded-md bg-neutral-0 py-1 text-sm shadow-lg ring-1 ring-neutral-1000/5 focus:outline-none">
            {searchTerm !== "" && filteredPersons.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-neutral-700">
                Nothing found
              </div>
            ) : null}
            <div ref={setElement} className="overflow-auto max-h-96">
              <div
                className="w-full relative"
                style={{ height: virtualizer.getTotalSize() }}
              >
                {virtualizer.getVirtualItems().map((item) => {
                  const person = filteredPersons[item.index]!;

                  return (
                    <Combobox.Option
                      key={person.id}
                      value={person.id}
                      className="absolute top-0 left-0 w-full cursor-default select-none py-2.5 pl-10 pr-4 ui-active:bg-primary-100 ui-active:text-primary-900"
                      style={{
                        height: item.size,
                        transform: `translateY(${item.start}px)`,
                      }}
                    >
                      {({ selected }) => {
                        return (
                          <Fragment>
                            <span className="block truncate ui-selected:font-medium">
                              {person.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                                <CheckMarkIcon
                                  aria-hidden
                                  className="h-5 w-5"
                                />
                              </span>
                            ) : null}
                          </Fragment>
                        );
                      }}
                    </Combobox.Option>
                  );
                })}
              </div>
            </div>
          </Combobox.Options>
        </Combobox>
      </div>
    </div>
  );
}
