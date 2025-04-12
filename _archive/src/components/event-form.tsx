"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addHours, addMinutes, format, parse } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventSchema } from "@/schemas";
import { useToast } from "@/hooks/use-toast";

const timeOptions = Array.from({ length: 24 * 4 }).map((_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  const time = new Date();
  time.setHours(hour, minute, 0, 0);
  return {
    value: format(time, "HH:mm"),
    label: format(time, "h:mm a"),
  };
});

interface EventFormProps {
  userId: string;
  initialDate?: string;
  initialAllDay?: boolean;
  eventId?: string; // For editing existing events
}

export function EventForm({ userId, initialDate, initialAllDay = false, eventId }: EventFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!eventId);

  // Create form with validation schema
  const form = useForm<z.infer<typeof EventSchema>>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: initialDate ? new Date(initialDate) : new Date(),
      endDate: initialDate 
        ? addHours(new Date(initialDate), 1) 
        : addHours(new Date(), 1),
      location: "",
      isAllDay: initialAllDay,
      color: "blue",
    },
  });

  // Fetch event data if in edit mode
  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error("Failed to load event");
        
        const event = await response.json();
        form.reset({
          title: event.title,
          description: event.description || "",
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          location: event.location || "",
          isAllDay: event.isAllDay,
          color: event.color || "blue",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load event data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, form, toast]);

  // Submit event handler
  async function onSubmit(data: z.infer<typeof EventSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch(
        eventId ? `/api/events/${eventId}` : "/api/events", 
        {
          method: eventId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save event");
      }

      toast({
        title: "Success",
        description: `Event ${eventId ? "updated" : "created"} successfully`,
      });

      router.push("/calendar");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle delete event
  async function handleDelete() {
    if (!eventId) return;
    
    if (!confirm("Are you sure you want to delete this event?")) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });

      router.push("/calendar");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Event title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Event description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isAllDay"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>All Day</FormLabel>
                  <FormDescription>
                    Event will last the entire day
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!form.watch("isAllDay") && (
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Time</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const [hour, minute] = value.split(":").map(Number);
                        const newDate = new Date(field.value);
                        newDate.setHours(hour, minute);
                        field.onChange(newDate);
                      }}
                      defaultValue={format(field.value, "HH:mm")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!form.watch("isAllDay") && (
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Time</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const [hour, minute] = value.split(":").map(Number);
                        const newDate = new Date(field.value);
                        newDate.setHours(hour, minute);
                        field.onChange(newDate);
                      }}
                      defaultValue={format(field.value, "HH:mm")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Event location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="indigo">Indigo</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            
            <div className="space-x-2">
              {isEditMode && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              )}
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEditMode ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
