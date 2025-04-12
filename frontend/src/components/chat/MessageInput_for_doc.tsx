"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CornerDownLeft, ChevronsUpDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { commands } from "@/data/commands";
import { cn } from "@/lib/utils";
import { BulkLaboratoryTestRequestDrawer } from "@/components/drawers/laboratory-request";
import { PrescribeDrawer } from "@/components/drawers/prescribe-drawer";
import { RecommendDrawer } from "@/components/drawers/recommend-drawer";
import { FinishDiagnosisButton } from "@/components/drawers/finishDiagnosisButton";
import { AskFollowUpQuestionDrawer } from "@/components/drawers/ask-followup-drawer";

type MessageInputProps = {
  userQuery: string;
  setUserQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  handleComboBoxSelect: (selectedValue: string) => void;
  diagnosis_id: string;
};

const MessageInput: React.FC<MessageInputProps> = ({
  userQuery,
  setUserQuery,
  handleSubmit,
  isLoading,
  error,
  open,
  setOpen,
  value,
  handleComboBoxSelect,
  diagnosis_id,
}) => {
  return (
    <div className="mx-auto  max-w-5xl border rounded-lg bg-background p-3 mb-2 mt-2">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="h-full"
              >
                {value
                  ? commands.find((command) => command.value === value)?.label
                  : "Command"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px]">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandEmpty>No command found.</CommandEmpty>
                  <CommandGroup>
                    {commands.map((command) => (
                      <CommandItem
                        key={command.value}
                        value={command.value}
                        onSelect={() => handleComboBoxSelect(command.value)}
                      >
                        {command.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === command.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex flex-wrap items-center gap-1">
            <BulkLaboratoryTestRequestDrawer diagnosis_id={diagnosis_id} />
            <AskFollowUpQuestionDrawer context_id={diagnosis_id} />
            {/* <PatientRecordDrawer diagnosis_id={diagnosis_id} /> */}
            <PrescribeDrawer diagnosis_id={diagnosis_id} />
            <RecommendDrawer diagnosis_id={diagnosis_id} />
            <FinishDiagnosisButton diagnosisId={diagnosis_id} />
          </div>

          <Button
            type="submit"
            size="sm"
            className="shrink-0"
            disabled={isLoading || !userQuery.trim()}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send
                <CornerDownLeft className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {error && (
          <Badge variant="destructive" className="mt-1">
            {error}
          </Badge>
        )}
      </form>
    </div>
  );
};

export default MessageInput;
