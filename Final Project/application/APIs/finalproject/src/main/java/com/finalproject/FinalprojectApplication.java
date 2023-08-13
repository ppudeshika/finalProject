package com.finalproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
@DependsOn({"dteLoggingUtils"})
@Import({PrometheusScrapeEndpoint.class, CollectorRegistry.class})
@EnableDtePlugins
@EntityScan(basePackages = { "com.adl.et.telco.dte.chargingandbilling.entitymanager.entities", "com.adl.et.telco.dte"
		+ ".chargingandbilling.configurationmanager"})
public class FinalprojectApplication {

	public static void main(String[] args) {
		try {
			setHostAddress();
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
		SpringApplication.run(FinalprojectApplication.class, args);
	}
}
